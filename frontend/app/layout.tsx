import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../components/style/toast.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "A simple tic tac toe game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > 
          <Toaster 
            toastOptions={{
              className: 'toast',
          }}/>
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
