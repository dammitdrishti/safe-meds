export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  conditions: string[];
  allergies: string[];
  medications: string[]; // Currently taking
}

export interface DrugIdentity {
  brandName: string | null;
  genericName: string | null;
  strength: string | null;
  confidence: number;
}

export interface SafetyAnalysis {
  isSafe: boolean;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  summary: string;
  contraindications: string[];
  sideEffects: string[];
  purpose: string;
  recommendation: string;
}

export interface FdaData {
  purpose?: string[];
  warnings?: string[];
  contraindications?: string[];
  boxed_warning?: string[];
  indications_and_usage?: string[];
  brand_name?: string[];
  generic_name?: string[];
}

export enum AppState {
  PROFILE = 'PROFILE',
  SCAN = 'SCAN',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}