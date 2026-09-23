import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EndorsementTemplateFieldEntity } from './endorsement-template-field.entity';
import { EndorsementTemplateEventEntity } from './endorsement-template-event.entity';

/**
 * Representa una versión de plantilla de traducción asociada a un producto y tipo de endoso.
 */
@Entity({ name: 'endorsement_templates' })
export class EndorsementTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public product!: string;

  @Column({ name: 'endorsement_type' })
  public endorsementType!: string;

  @Column({ type: 'integer' })
  public version!: number;

  @Column({ default: true })
  public active!: boolean;

  @Column({ name: 'event_description' })
  public eventDescription!: string;

  @Column({ name: 'risk_unit_number', default: '1' })
  public riskUnitNumber!: string;

  @Column({ name: 'insurance_object_number', default: '1' })
  public insuranceObjectNumber!: string;

  @OneToMany(() => EndorsementTemplateFieldEntity, (field) => field.template)
  public fields!: EndorsementTemplateFieldEntity[];

  @OneToMany(() => EndorsementTemplateEventEntity, (event) => event.template)
  public appliedEvents!: EndorsementTemplateEventEntity[];
}
