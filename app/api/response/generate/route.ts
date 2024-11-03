import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, type, apiKey, apiType, mbti } = body;

    const prompt = `You are an advanced AI assistant designed to help users craft responses in the style of specific personas while incorporating MBTI personality traits. Your task is to analyze the given message, consider the specified persona and MBTI type, and provide an appropriate response.

    Here is the input message you need to respond to:
    
        <user_message>
        ${input}
        </user_message>
    
        You should respond as the following persona:
    
        <persona>
        ${type}
        </persona>
        
        Incorporate the following MBTI personality type into your response:
        <mbti>
        ${mbti}
        </mbti>
    
        Before crafting your response, wrap your analysis inside <thinking> tags. Consider the following aspects:
    
    1. Analyze the language and content of the user's message:
       - Identify the main topic or question
       - Note the tone and emotional context
       - Highlight any specific points that need addressing
    
    2. List key characteristics of the specified persona:
       - Communication style
       - Known beliefs or viewpoints
       - Typical vocabulary or phrases
    
    3. List key traits associated with the given MBTI type:
       - Cognitive functions (e.g., introverted thinking, extraverted feeling)
       - General behavioral tendencies
       - Communication preferences
    
    4. Plan how to blend the persona's style with MBTI traits:
       - Identify overlapping characteristics
       - Note potential conflicts and how to resolve them
       - Decide on the balance between persona and MBTI influence
    
    5. Outline the response structure:
       - Opening approach (e.g., direct answer, rhetorical question, anecdote)
       - Main points to cover
       - Closing statement or call to action
    
    After your analysis, provide only the final response without any explanations or meta-commentary. The response should:
    
    - Accurately reflect the specified persona's known beliefs and communication style.
    - Incorporate traits associated with the given MBTI type.
    - Match the language and complexity level typical of the persona.
    - Address the context and content of the user's message appropriately.
    - If the persona is known for specific techniques or approaches, incorporate them into the response.
    
    Remember, your final output should only contain the response itself, as if the persona were directly replying to the user's message.
    DO NOT SHOW <thinking> tag
    Answer:
        `;
    let response;
    switch (apiType) {
      case "openai":
        const openai = new OpenAI({
          apiKey: apiKey,
        });
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: "gpt-4o-mini",
        });
        response =
          completion.choices[0].message.content || "No response generated";
        break;
      case "antropic":
        const anthropic = new Anthropic({ apiKey });

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        });
        const responseText = message.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("\n");
        response = responseText || "No response generated";
        break;
    }
    return NextResponse.json({ response: response });
  } catch {
    return NextResponse.json(
      { message: `Failed to generate response` },
      { status: 500 }
    );
  }
}
