import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const inter = { variable: "" };
const jetbrainsMono = { variable: "" };

export const metadata: Metadata = {
  title: "EcoSort — Waste Management Platform",
  description: "Manage waste categories, items, and disposal guidance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "text-sm",
              style: {
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                color: "#18181b",
              },
              success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
              error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
