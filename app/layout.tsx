import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordProtection from "@/components/PasswordProtection";

export const metadata: Metadata = {
  title: "Division of Inclusive Excellence Digital Handbook | Whitman College",
  description: "Your central hub for resources, policies, and services from Whitman College's Division of Inclusive Excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <PasswordProtection>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </PasswordProtection>
      </body>
    </html>
  );
}

