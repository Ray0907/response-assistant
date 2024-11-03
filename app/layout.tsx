import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Response Assistant",
  description:
    "An intelligent assistant that generates customized responses based on MBTI personality types",
  keywords: [
    "AI",
    "Response Generator",
    "MBTI",
    "OpenAI",
    "Claude",
    "Assistant",
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
