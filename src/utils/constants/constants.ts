export const API_ROUTES = {
  swaggerConfig: 'config',
  swaggerDocument: 'doc',
  swaggerStaticEndpoint: '/swagger-static',
};

export const API_VERSION_1 = '/api/v1';

export const swaggerInitScript = (
  swaggerConfigUrl: string,
) => `<script nonce="swaggerInitializer">
window.onload = function () {
  window.ui = SwaggerUIBundle({
    url: '${swaggerConfigUrl}',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout',
  });
};
</script>`;

export const SWAGGER_BASE_ROUTE = '/swagger'