import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EndorsementTemplateEntity } from './endorsement-template.entity';

/**
 * Representa un campo dinámico y su regla de resolución dentro de una plantilla.
 */
@Entity({ name: 'endorsement_template_fields' })
export class EndorsementTemplateFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 150 })
  public label!: string;

  @Column({ name: 'source_field', type: 'varchar', length: 150, nullable: true })
  public sourceField!: string | null;

  @Column({ name: 'default_value', type: 'text', nullable: true })
  public defaultValue!: string | null;

  @Column({ default: false })
  public required!: boolean;

  @Column({ name: 'field_order', type: 'integer' })
  public order!: number;

  @ManyToOne(() => EndorsementTemplateEntity, (template) => template.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template!: EndorsementTemplateEntity;
}
