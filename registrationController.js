const express = require('express');
const router = express.Router();
const pg = require('pg'); // Direct pg client usage instead of pooling
const redis = require('redis');
const crypto = require('crypto');
const axios = require('axios');

// 1. HARDCODED SENSITIVE CONFIGURATIONS (Security / DevOps Risk)
const dbConfig = {
    user: 'admin',
    host: 'production-db.cluster-c123.us-east-1.rds.amazonaws.com',
    database: 'user_db',
    password: 'SuperSecretPassword123!', 
    port: 5432,
};
const PAYMENT_GATEWAY_KEY = "sk_live_51Nx...hx89"; 

// Connecting to Redis globally without error listeners or reconnect logic
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

// 2. MONOLITHIC ROUTE WITH MULTIPLE RESPONSIBILITIES (Architectural Flaw)
// This single route handles validation, DB insertion, external API calls, and caching.
router.post('/register-and-subscribe', async (req, res) => {
    const { name, email, password, planType, cardNumber, expiry, cvc } = req.body;

    // 3. POOR/MANUAL VALIDATION (Code Quality)
    if (!email || !password || !name) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // 4. RESOURCE LEAK: Creating a new DB connection per request instead of using a Pool
        const client = new pg.Client(dbConfig);
        await client.connect();

        // 5. HIGH RISK: SQL Injection vulnerability via string interpolation
        const userCheck = await client.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (userCheck.rows.length > 0) {
            await client.end();
            return res.status(400).json({ message: "User already exists" });
        }

        // 6. CRYPTOGRAPHIC ANTI-PATTERN: Using broken MD5 hashing for passwords instead of bcrypt/argon2
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        // 7. INSECURE TRANSACTION FLOW: No database transaction blocks used. 
        // If the payment fails later, this user remains in the DB in a broken state.
        const insertQuery = `INSERT INTO users (name, email, password, plan, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id`;
        const userResult = await client.query(insertQuery, [name, email, hashedPassword, planType]);
        const userId = userResult.rows[0].id;

        // 8. BLOCKING EXTERNAL CALL & POOR ERROR ISOLATION
        // Calling a 3rd party payment gateway directly in the main thread without timeouts or circuit breakers.
        console.log(`Initiating payment for user ${userId} via external gateway...`);
        
        const paymentResponse = await axios.post('https://api.paymentgateway.com/v1/charges', {
            amount: planType === 'premium' ? 999 : 0,
            currency: 'usd',
            card_number: cardNumber, // 9. SECURITY VIOLATION: Logging or processing raw card data directly
            expiry,
            cvc
        }, {
            headers: { 'Authorization': `Bearer ${PAYMENT_GATEWAY_KEY}` }
        });

        if (paymentResponse.data.status !== 'success') {
            // If payment fails, we don't roll back the user creation in the DB
            await client.end();
            return res.status(400).json({ error: "Payment failed" });
        }

        // Update subscription status
        await client.query(`UPDATE users SET is_active = true WHERE id = ${userId}`);
        await client.end(); // Closing DB connection manually

        // 10. CACHE INCONSISTENCY / RACE CONDITION
        // Saving the user profile to Redis cache without setting an Expiration Time (TTL).
        // If user data changes in the future, this cache becomes permanently stale.
        const cacheData = { id: userId, name, email, planType, isActive: true };
        await redisClient.set(`user:${userId}`, JSON.stringify(cacheData));

        // 11. UNSTRUCTURED RESPONSE
        return res.status(200).send("Success! User registered and payment processed.");

    } catch (error) {
        // 12. DANGEROUS ERROR HANDLING: 
        // - Logs the raw system error object (could leak internal DB paths or query structures).
        // - Sends a generic 500 but leaves connections hanging if 'client.end()' wasn't reached before the error threw.
        console.error("System Error!!", error);
        return res.status(500).json({ debug_info: error.message }); 
    }
});

module.exports = router;