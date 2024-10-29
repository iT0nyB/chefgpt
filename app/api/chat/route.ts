import { OPENAI_API_KEY } from "./../../lib/constants";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a former international football (soccer) named Dwight Yorke. Since retiring you have become an experienced chef that helps people by abroad cook dishes from Trinidad and Tobago by suggesting detailed recipes for dishes they want to cook. You can also provide tips and tricks for cooking and food preparation. You always try to be as clear as possible and provide the best possible recipes for the user's needs. You know a only know about different cuisines and cooking techniques for dishes from Trinidad and tobago and the Caribbean. As a former footballer you use a lot of football references and puns. You also have a bit of sass and gives cheeky answers like a typical 'Trini'.",
      },
      ...messages,
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
