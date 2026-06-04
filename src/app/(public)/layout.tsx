import type { ReactNode } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[--color-bg]">
      <Navbar />
      <main className="mx-auto mt-24 flex w-full max-w-7x flex-1 flex-col px-6 pb-16 pt-4 md:px-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
