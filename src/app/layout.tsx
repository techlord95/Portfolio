import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import { ThemeProvider } from "@/components/ThemeContext";
import ThemeEditor from "@/components/ThemeEditor";
import { ChatProvider } from "@/context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gosrijan.com"),
  title: {
    default: "Srijan Ramnani | Generative AI Engineer & Full Stack Developer",
    template: "%s | Srijan Ramnani"
  },
  description: "Portfolio of Srijan Ramnani, a Generative AI Engineer and Full Stack Developer specializing in Python, Next.js, and GCP. View projects, skills, and resume.",
  keywords: [
    "Srijan Ramnani", 
    "Generative AI Engineer", 
    "Full Stack Developer", 
    "Python Developer", 
    "Next.js Developer", 
    "AI Portfolio", 
    "Software Engineer Resume",
    "Machine Learning Engineer",
    "Freelance AI Developer",
    "Contract Software Engineer",
    "Hire GenAI Developer"
  ],
  authors: [{ name: "Srijan Ramnani" }],
  creator: "Srijan Ramnani",
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://www.gosrijan.com",
    title: "Srijan Ramnani | Generative AI & Full Stack Engineer",
    description: "Results-driven Generative AI Engineer with expertise in building scalable AI pipelines, SLMs, and full-stack web applications.",
    siteName: "Srijan Ramnani Portfolio",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists or is created
        width: 1200,
        height: 630,
        alt: "Srijan Ramnani Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Srijan Ramnani | GenAI Engineer",
    description: "Explore the portfolio of Srijan Ramnani, featuring projects in Generative AI, RAG, and Full Stack Development.",
    creator: "@srijanramnani", // Update if you have a specific handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Srijan Ramnani",
    "url": "https://www.gosrijan.com",
    "jobTitle": "Generative AI Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Intellexia AI"
    },
    "sameAs": [
      "https://linkedin.com/in/srijanramnani15/",
      "https://github.com/techlord95"
    ],
    "description": "Founding SDE at Intellexia AI, specializing in Generative AI, Python, Docker, and GCP. Experienced in building AI-powered resume translation pipelines and SLMs.",
    "knowsAbout": ["Generative AI", "Python", "Next.js", "Docker", "GCP", "Machine Learning", "System Design", "FastAPI"]
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ChatProvider>
          <ThemeProvider>
              <Cursor />
              <ThemeEditor />
              {children}
          </ThemeProvider>
        </ChatProvider>
        <Analytics />
      </body>
    </html>
  );
}
