"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let mounted = true;

    async function checkSession() {
      const { data } = await supabaseBrowserClient.auth.getUser();
      if (!mounted) return;

      if (!data.user) {
        setAuthenticated(false);
        router.replace("/admin/login");
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router, pathname, isLoginPage]);

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[--color-surface] text-xs text-[--color-text-muted]">
        Checking session...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[--color-surface]">
      <header className="border-b border-[--color-border] bg-[--color-surface]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
          <div className="space-y-1">
            <p
              className="text-xs uppercase tracking-[0.18em] text-[--color-text-muted]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Admin · Nick Souza
            </p>
            <p className="text-xs text-[--color-text-muted]">
              Manage projects, drafts and publication status.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              target="_blank"
              className="border border-[--color-border] bg-[--color-bg] px-3 py-1.5 uppercase tracking-[0.16em] text-[--color-text-muted]"
            >
              Ver site público
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-[--color-text-primary] bg-[--color-text-primary] px-3 py-1.5 uppercase tracking-[0.16em] text-xs text-black"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-10 pt-6 md:px-10">
        {children}
      </main>
    </div>
  );
}

