import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EndorsementTemplateEntity } from './endorsement-template.entity';

/**
 * Representa un evento aplicado y su posición dentro de la secuencia del endoso.
 */
@Entity({ name: 'endorsement_template_events' })
export class EndorsementTemplateEventEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public description!: string;

  @Column({ name: 'order_event', type: 'integer' })
  public orderEvent!: number;

  @ManyToOne(() => EndorsementTemplateEntity, (template) => template.appliedEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  public template!: EndorsementTemplateEntity;
}
