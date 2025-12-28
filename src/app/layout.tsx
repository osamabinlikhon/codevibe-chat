import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeVibe Chat - AI Code Assistant",
  description:
    "A powerful AI chat application with secure code execution powered by Groq and E2B",
  openGraph: {
    title: "CodeVibe Chat - AI Code Assistant",
    description: "A powerful AI chat application with secure code execution powered by Groq and E2B",
    url: "https://codevibe-chat.vercel.app",
    siteName: "CodeVibe Chat",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeVibe Chat - AI Code Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeVibe Chat - AI Code Assistant",
    description: "A powerful AI chat application with secure code execution powered by Groq and E2B",
    images: ["/og-image.png"],
    creator: "@codevibe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
