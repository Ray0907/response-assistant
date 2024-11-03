import { NextResponse } from "next/server";

export async function GET() {
  // Add your logic to fetch response types
  const types = [
    { name: "The Witty Conversationalist" },
    { name: "The Genuine Connector" },
    { name: "Adventure Seeker" },
    { name: "The Intellectual Charmer" },
  ];

  return NextResponse.json(types);
}
