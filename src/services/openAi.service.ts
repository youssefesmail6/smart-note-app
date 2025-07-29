import OpenAI from "openai";
import env from "../config/env.config";
import { Service } from "typedi";

@Service()
export class OpenAIService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI.API_KEY,
      baseURL: "https://api.groq.com/openai/v1", // Groq's base URL
    });
  }

  async summarizeText(content: string): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "Summarize the following note in one paragraph.",
        },
        { role: "user", content },
      ],
    });

    return (
      chatCompletion.choices[0].message?.content?.trim() ||
      "No summary available."
    );
  }
}
