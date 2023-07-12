"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "./ui/toaster";

type ProvidersProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
