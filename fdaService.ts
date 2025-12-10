import { FdaData } from "../types";

const BASE_URL = "https://api.fda.gov/drug/label.json";

export async function fetchDrugData(drugName: string): Promise<FdaData | null> {
  try {
    // Sanitize drug name for search (remove dosage, simple text)
    const sanitizedName = drugName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    
    // Construct query: search in both brand and generic names
    // Note: OpenFDA search values must be properly encoded or spaced.
    // Using encodeURIComponent on the whole query helps with special characters.
    const query = `openfda.brand_name:"${sanitizedName}"+OR+openfda.generic_name:"${sanitizedName}"`;
    const url = `${BASE_URL}?search=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Drug not found in OpenFDA database.");
        return null;
      }
      throw new Error(`OpenFDA API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch FDA data:", error);
    return null;
  }
}