import { UserProfile } from "./types";

export const DEFAULT_PROFILE: UserProfile = {
  age: 30,
  gender: 'male',
  conditions: [],
  allergies: [],
  medications: []
};

export const COMMON_CONDITIONS = [
  "High Blood Pressure",
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Asthma",
  "Heart Disease",
  "Pregnancy",
  "Kidney Disease",
  "Liver Disease",
  "Acid Reflux"
];

export const COMMON_ALLERGIES = [
  "Penicillin",
  "Sulfa Drugs",
  "Aspirin",
  "Peanuts",
  "Latex",
  "Ibuprofen (NSAIDs)"
];