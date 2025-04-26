// eslint-disable-next-line no-unused-vars
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const model = google("gemini-1.5-pro-latest");
export async function GET(request: Request) {
  try {
    const promt =
    "Create a list of three NEW and FRESH open-ended , brief, and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interactions. For example, your output should be strucutured like this: 'What is your favorite book?||If you could travel anywhere, where would you go?||What is a skill you've always wanted to learn?'. Ensure the questions are intriguingm foster curiosity, and contribute to a positive and welcome conversational environment. Please do not include any emojis or special characters in the output.";
    const { text } = await generateText({
      model,
      prompt: promt,
      temperature: 0.8,
      maxTokens: 200,
      topP: 0.9,
    });
    if (text) {
      return Response.json({ text }, { status: 200 });
    }
    return Response.json({ error: "No text generated" }, { status: 500 });
  } catch (error) {
    console.log("Error generating text:", error);
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
