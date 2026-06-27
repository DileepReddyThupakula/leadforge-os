import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
// Initialize GenAI client. If API key is missing, we fall back to a mock responder.
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const ARIA_SYSTEM_PROMPT = `
You are Aria, an AI Sales Employee for LeadForge OS.
Your objective is to naturally qualify real estate buyers.
Converse with the buyer in a warm, consultative, professional manner.

CRITICAL RULES:
1. Never ask all questions at once. Ask only ONE (or at most two related) questions at a time in reaction to what the buyer says.
2. Ensure you collect the following details organically over the course of the conversation:
   - Name
   - Phone
   - Email
   - Property type (e.g. Condo, Single Family Home, Townhouse)
   - Budget (e.g. $500,000)
   - Location (target cities/areas)
   - Timeline (when they want to buy)
   - Financing (e.g. cash, mortgage pre-approved, needs pre-approval)
   - Purpose (primary home, investment, vacation)
3. Keep responses conversational, concise, and helpful. Focus on the real estate context.
`;

export interface QualificationData {
  propertyType?: string | null;
  budget?: number | null;
  location?: string | null;
  timeline?: string | null;
  financing?: string | null;
  purpose?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  isFullyQualified: boolean;
  score?: number | null;
  summary?: string | null;
  intent?: "HOT" | "WARM" | "COLD" | null;
  recommendedAction?: string | null;
}

export class GeminiService {
  /**
   * Generates the next response from Aria.
   */
  static async generateResponse(messages: { sender: string; content: string }[]): Promise<string> {
    if (!genAI) {
      return this.generateMockResponse(messages);
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: ARIA_SYSTEM_PROMPT,
      });

      // Map DB message list to Gemini Chat History structure
      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.sender.toLowerCase() === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const latestMsg = messages[messages.length - 1];
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(latestMsg.content);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API call failed:", error);
      return this.generateMockResponse(messages);
    }
  }

  /**
   * Evaluates the conversation and extracts structured qualification data.
   */
  static async extractQualification(messages: { sender: string; content: string }[]): Promise<QualificationData> {
    if (!genAI) {
      return this.generateMockExtraction(messages);
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              propertyType: { type: SchemaType.STRING },
              budget: { type: SchemaType.NUMBER },
              location: { type: SchemaType.STRING },
              timeline: { type: SchemaType.STRING },
              financing: { type: SchemaType.STRING },
              purpose: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              phone: { type: SchemaType.STRING },
              email: { type: SchemaType.STRING },
              isFullyQualified: { type: SchemaType.BOOLEAN },
              score: { type: SchemaType.INTEGER },
              summary: { type: SchemaType.STRING },
              intent: { type: SchemaType.STRING, description: "Lead intent: HOT, WARM, or COLD" },
              recommendedAction: { type: SchemaType.STRING },
            },
            required: ["isFullyQualified"],
          },
        },
      });

      const conversationText = messages
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");

      const prompt = `
Analyze the following conversation logs between a user and the qualifying agent Aria.
Extract the qualification status and fill out the parameters.
If a parameter is not explicitly disclosed, return null for it.

Conversation Logs:
${conversationText}
`;

      const result = await model.generateContent(prompt);
      const jsonText = result.response.text();
      return JSON.parse(jsonText) as QualificationData;
    } catch (error) {
      console.error("Gemini extraction failed:", error);
      return this.generateMockExtraction(messages);
    }
  }

  private static generateMockResponse(messages: { sender: string; content: string }[]): string {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
    
    if (lastUserMsg.includes("hello") || lastUserMsg.includes("hi")) {
      return "Hi there! I'm Aria, your real estate assistant. Are you looking to buy a property soon? If so, what type of home are you thinking about?";
    }
    if (lastUserMsg.includes("condo") || lastUserMsg.includes("house") || lastUserMsg.includes("family")) {
      return "That sounds wonderful! What is your budget range for this purchase, and which cities or locations are you targeting?";
    }
    if (lastUserMsg.includes("$") || lastUserMsg.includes("budget") || lastUserMsg.includes("thousand") || lastUserMsg.includes("million")) {
      return "Got it. And how soon are you planning to make the purchase? Are you hoping to close in the next couple of months, or are you just exploring?";
    }
    if (lastUserMsg.includes("month") || lastUserMsg.includes("immediate") || lastUserMsg.includes("soon")) {
      return "Perfect. Have you spoken with a lender yet to get pre-approved for a mortgage, or will this be a cash purchase?";
    }
    return "Great details. Could you share your name, phone number, and email address so that our sales development representative can send over matching properties?";
  }

  private static generateMockExtraction(messages: { sender: string; content: string }[]): QualificationData {
    const text = messages.map(m => m.content.toLowerCase()).join(" ");
    
    // Naive regex matching for mock test fallback
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    let budget: number | null = null;
    const budgetMatch = text.match(/\$?(\d{3,7})/);
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1], 10);
    }

    const hasContactInfo = !!(emailMatch || phoneMatch);
    const score = hasContactInfo ? 85 : 35;
    const intent = score >= 75 ? "HOT" : "WARM";

    return {
      propertyType: text.includes("condo") ? "Condo" : text.includes("house") ? "Single Family Home" : null,
      budget,
      location: text.includes("boston") ? "Boston" : text.includes("austin") ? "Austin" : null,
      timeline: text.includes("immediate") ? "Immediate" : "3-6 Months",
      financing: text.includes("cash") ? "Cash" : "Pre-approved",
      purpose: "Primary Residence",
      name: "John Doe",
      phone: phoneMatch ? phoneMatch[0] : null,
      email: emailMatch ? emailMatch[0] : null,
      isFullyQualified: hasContactInfo,
      score,
      summary: "Customer looking for residential property.",
      intent,
      recommendedAction: "Schedule a discovery call to present listings.",
    };
  }

  static async generateInsights(messages: { sender: string; content: string }[]): Promise<InsightsData> {
    if (!genAI) {
      return this.generateMockInsights(messages);
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              score: { type: SchemaType.INTEGER },
              temperature: { type: SchemaType.STRING, description: "HOT, WARM, or COLD" },
              intent: { type: SchemaType.STRING },
              budgetConfidence: { type: SchemaType.NUMBER },
              timelineConfidence: { type: SchemaType.NUMBER },
              contactCompleteness: { type: SchemaType.NUMBER },
              completionPercentage: { type: SchemaType.NUMBER },
              summary: { type: SchemaType.STRING },
              recommendedAction: { type: SchemaType.STRING },
              priority: { type: SchemaType.STRING },
              riskFlags: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              reason: { type: SchemaType.STRING },
              suggestedTasks: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    dueDays: { type: SchemaType.INTEGER },
                  },
                  required: ["title", "description", "dueDays"],
                },
              },
            },
            required: [
              "score",
              "temperature",
              "intent",
              "budgetConfidence",
              "timelineConfidence",
              "contactCompleteness",
              "completionPercentage",
              "summary",
              "recommendedAction",
              "priority",
              "riskFlags",
              "reason",
              "suggestedTasks",
            ],
          },
        },
      });

      const conversationText = messages
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");

      const prompt = `
Analyze the following conversation logs between a real estate buyer and the qualifying agent Aria.
Produce the insights data, decision explainability rationale, and suggested CRM follow-up tasks.

Conversation Logs:
${conversationText}
`;

      const result = await model.generateContent(prompt);
      const jsonText = result.response.text();
      return JSON.parse(jsonText) as InsightsData;
    } catch (error) {
      console.error("Gemini insights generation failed:", error);
      return this.generateMockInsights(messages);
    }
  }

  private static generateMockInsights(messages: { sender: string; content: string }[]): InsightsData {
    const text = messages.map((m) => m.content.toLowerCase()).join(" ");
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);

    const hasContact = !!(emailMatch || phoneMatch);
    const hasBudget = text.includes("$") || text.includes("budget") || text.includes("thousand") || text.includes("million");
    const hasLocation = text.includes("boston") || text.includes("austin") || text.includes("location");
    const hasTimeline = text.includes("immediate") || text.includes("month") || text.includes("soon");

    let score = 30;
    if (hasContact) score += 30;
    if (hasBudget) score += 15;
    if (hasLocation) score += 15;
    if (hasTimeline) score += 10;

    const temperature = score >= 75 ? "HOT" : score >= 45 ? "WARM" : "COLD";
    const contactCompleteness = hasContact ? 1.0 : 0.0;
    const budgetConfidence = hasBudget ? 0.9 : 0.1;
    const timelineConfidence = hasTimeline ? 0.8 : 0.2;
    const completionPercentage = ((score - 30) / 70) * 100;

    const reason = `Lead scored ${score} because:
- Contact information: ${hasContact ? "Provided" : "Missing"}
- Budget indicators: ${hasBudget ? "Exposed" : "Incomplete"}
- Purchasing timeline: ${hasTimeline ? "Disclosed" : "Undetermined"}`;

    return {
      score,
      temperature,
      intent: score >= 75 ? "Strong purchase interest" : "General discovery phase",
      budgetConfidence,
      timelineConfidence,
      contactCompleteness,
      completionPercentage: Math.max(0, Math.min(100, completionPercentage)),
      summary: "Qualified lead via real estate chat session.",
      recommendedAction: score >= 75 ? "Call immediately" : "Ask for missing information",
      priority: score >= 75 ? "HIGH" : "MEDIUM",
      riskFlags: hasContact ? [] : ["Missing primary contact credentials"],
      reason,
      suggestedTasks: [
        {
          title: "Call tomorrow",
          description: "Reach out to lead to clarify property requirements.",
          dueDays: 1,
        },
        {
          title: "Verify financing",
          description: "Follow up regarding pre-approval letter status.",
          dueDays: 3,
        },
      ],
    };
  }
}

export interface InsightsData {
  score: number;
  temperature: "HOT" | "WARM" | "COLD";
  intent: string;
  budgetConfidence: number;
  timelineConfidence: number;
  contactCompleteness: number;
  completionPercentage: number;
  summary: string;
  recommendedAction: string;
  priority: string;
  riskFlags: string[];
  reason: string;
  suggestedTasks: {
    title: string;
    description: string;
    dueDays: number;
  }[];
}

