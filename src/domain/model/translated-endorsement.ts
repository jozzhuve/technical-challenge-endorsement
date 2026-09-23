export interface DynamicDataItem {
  etiqueta: string;
  value: string;
}

export interface TranslatedEndorsement {
  policyNumber: string;
  idEnvio: number;
  financialPlansEntity: { description: string };
  currency: { description: string };
  productEntity: { description: string };
  eventEntity: {
    description: string;
    dynamicData: DynamicDataItem[];
  };
  eventAppliedEntities: Array<{
    description: string;
    orderEvent: number;
  }>;
  riskUnitEntities: Array<{
    insuranceObjectEntities: Array<{
      insuranceObjectNumber: string;
      coverageEntities: unknown[];
      participationEntities: unknown[];
    }>;
    plansEntity: { description: string };
    riskUnitNumber: string;
    participationEntities: unknown[];
  }>;
}
