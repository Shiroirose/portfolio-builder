import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TwicInstall } from "@twicpics/components/react";
import "@twicpics/components/style.css";
import Provider from "./Provider";
import React from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CraftFolio",
  description: "Way to Craft your Portfolio",
  icons: {
    icon: "/image/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div data-theme="dark" className="h-screen">
            <TwicInstall domain="https://sebonti.twic.pics" />
            <Provider>{children}</Provider>
            <ToastContainer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
