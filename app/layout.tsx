import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Response Assistant",
  description:
    "An AI assistant that tailors its responses to your MBTI personality type, adapting its communication style to match your natural way of thinking and interacting.",
  keywords: [
    "AI",
    "Response Generator",
    "MBTI",
    "OpenAI",
    "Claude",
    "Assistant",
    "Smart Assistant",
    "ChatGPT",
    "Claude",
    "MBTI-Tailored AI Assistant",
  ],
  // viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
