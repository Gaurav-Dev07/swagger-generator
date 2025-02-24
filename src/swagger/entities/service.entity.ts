import { COLUMN_NAME, SCHEMA_NAME, TABLE_NAME } from 'src/utils';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SwaggerConfig } from './swagger-config.entity';

@Entity({ name: TABLE_NAME.SERVICE, schema: SCHEMA_NAME.SWAGGER })
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: COLUMN_NAME.NAME, type: 'varchar', length: 48 })
  name: string;

  @OneToMany(() => SwaggerConfig, (swaggerConfig) => swaggerConfig.service)
  swaggerConfigurations: SwaggerConfig[];
}
