import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const inter = Inter({
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={inter.className}>
          <Navbar />
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
