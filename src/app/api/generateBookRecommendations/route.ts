import { ensureValidJson } from "@/app/utils/openaiUtils/ensureValidJson";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = (input: string) => {
  return `What books can you recommend to solve this problem: 
  PROBLEM DESCRIPTION:
  \`\`\`
  ${input}
  \`\`\`
  
  please return a valid json object with the book recommendations with the following format:

{
  "books": [
    {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald"
    }
  ]
}

please only include valid json in your response and no other comments and limit your response to three books
`;
};

export async function POST(request: Request) {
  try {
    const { input } = await request.json();
    console.log("input", input);
    console.log("prompt", prompt(input));
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt(input) }],
    });

    const response = completion.choices[0].message.content ?? "";
    console.log("response", response);

    const validJson = await ensureValidJson(response, {
      books: {
        type: "array",
        items: {
          type: "object",
          properties: {
            book: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  author: { type: "string" },
                },
                required: ["title", "author"],
              },
            },
          },
          required: ["book"],
        },
      },
    });

    return NextResponse.json(validJson);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
