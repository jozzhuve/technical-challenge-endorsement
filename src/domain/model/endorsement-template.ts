export interface TemplateField {
  label: string;
  sourceField: string | null;
  defaultValue: string | null;
  required: boolean;
  order: number;
}

export interface AppliedEvent {
  description: string;
  orderEvent: number;
}

export interface EndorsementTemplate {
  id: string;
  product: string;
  endorsementType: string;
  version: number;
  eventDescription: string;
  riskUnitNumber: string;
  insuranceObjectNumber: string;
  fields: TemplateField[];
  appliedEvents: AppliedEvent[];
}
