import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DrugIdentity, FdaData, SafetyAnalysis, UserProfile } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Step 1: Identify the drug from the image using Gemini Vision.
 */
export async function identifyDrugFromImage(base64Image: string): Promise<DrugIdentity> {
  const modelId = "gemini-2.5-flash"; // Multimodal model capable of text & image analysis

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      brandName: { type: Type.STRING, description: "The brand name of the medication, e.g., Tylenol" },
      genericName: { type: Type.STRING, description: "The active ingredient/generic name, e.g., Acetaminophen" },
      strength: { type: Type.STRING, description: "Dosage strength if visible, e.g., 500mg" },
      confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
    },
    required: ["brandName", "genericName", "confidence"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this image of a medication strip or bottle. Extract the Brand Name and Generic Name. Be precise. If the text is cut off but you can infer it with high certainty, do so. If you cannot identify it, return null for names."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1 // Low temperature for factual extraction
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini Vision");
    
    return JSON.parse(text) as DrugIdentity;

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to identify medication from image.");
  }
}

/**
 * Step 2: Analyze safety using User Profile + FDA Data + Gemini Knowledge.
 */
export async function analyzeDrugSafety(
  drugIdentity: DrugIdentity,
  userProfile: UserProfile,
  fdaData: FdaData | null
): Promise<SafetyAnalysis> {
  // Use a thinking model (or config) for better reasoning
  const modelId = "gemini-2.5-flash"; 

  const fdaContext = fdaData 
    ? JSON.stringify({
        warnings: fdaData.warnings,
        contraindications: fdaData.contraindications,
        boxed_warning: fdaData.boxed_warning,
        indications: fdaData.indications_and_usage,
        purpose: fdaData.purpose
      })
    : "Official FDA label not found. Rely on your internal medical knowledge.";

  const prompt = `
    Role: You are an expert clinical pharmacist and drug safety officer.
    Task: Analyze if the following medication is safe for the specific user based on their profile.
    
    Drug Identified: ${JSON.stringify(drugIdentity)}
    User Profile: ${JSON.stringify(userProfile)}
    
    Official FDA Label Data (Partial): ${fdaContext}

    Instructions:
    1. Check for DIRECT contraindications (e.g., High BP + NSAIDs, Liver Disease + Tylenol).
    2. Check for allergic reactions based on the user's allergy list.
    3. Check for DRUG-DRUG INTERACTIONS with the user's 'medications' list (e.g. taking Aspirin while on Warfarin).
    4. If the drug is safe, identify what it treats.
    5. Provide a risk assessment: LOW, MODERATE, HIGH, or CRITICAL.
    6. Be extremely cautious. If there is a known interaction, flag it in 'contraindications'.
    
    Output JSON format only.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isSafe: { type: Type.BOOLEAN, description: "True if generally safe, False if significant risks exist" },
      riskLevel: { type: Type.STRING, enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"] },
      summary: { type: Type.STRING, description: "A concise 1-2 sentence summary of the verdict, including any major interaction warnings." },
      contraindications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific conflicts with user profile, including drug interactions." },
      sideEffects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common side effects relevant to this drug." },
      purpose: { type: Type.STRING, description: "What this drug is used for." },
      recommendation: { type: Type.STRING, description: "Actionable advice (e.g., 'Do not take', 'Consult doctor', 'Safe to use')." }
    },
    required: ["isSafe", "riskLevel", "summary", "contraindications", "purpose", "recommendation"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 }, // Enable reasoning for safety check
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini Reasoning");

    return JSON.parse(text) as SafetyAnalysis;

  } catch (error) {
    console.error("Gemini Reasoning Error:", error);
    throw new Error("Failed to analyze drug safety.");
  }
}