import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EndorsementTemplateEntity } from './endorsement-template.entity';

/**
 * Representa un campo dinámico y su regla de resolución dentro de una plantilla.
 */
@Entity({ name: 'endorsement_template_fields' })
export class EndorsementTemplateFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public label!: string;

  @Column({ name: 'source_field', nullable: true })
  public sourceField!: string | null;

  @Column({ name: 'default_value', nullable: true })
  public defaultValue!: string | null;

  @Column({ default: false })
  public required!: boolean;

  @Column({ name: 'field_order', type: 'integer' })
  public order!: number;

  @ManyToOne(() => EndorsementTemplateEntity, (template) => template.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  public template!: EndorsementTemplateEntity;
}
