import { COLUMN_NAME, SCHEMA_NAME, TABLE_NAME } from '../../utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Entity({ name: TABLE_NAME.SWAGGER_CONFIG, schema: SCHEMA_NAME.SWAGGER })
export class SwaggerConfig {
  @PrimaryGeneratedColumn()
  swaggerConfigId: number;

  @Column({ type: 'jsonb', name: COLUMN_NAME.CONFIGURATION })
  configuration: object;

  @Column({
    type: 'varchar',
    length: 20,
    name: COLUMN_NAME.SWAGGER_CONFIGURATION_VERSION,
  })
  version: string;

  @Column({ type: 'varchar', length: 255, name: COLUMN_NAME.DESCRIPTION })
  description: string;

  @Column({ type: 'boolean', name: COLUMN_NAME.IS_ACTIVE, default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: COLUMN_NAME.IS_DELETED, default: false })
  isDeleted: boolean;

  @ManyToOne(() => ServiceEntity, (service) => service.swaggerConfigurations)
  @JoinColumn({ name: 'serviceId' }) // Correctly define the foreign key column name
  service: ServiceEntity;
}
