"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabaseBrowserClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!supabaseBrowserClient) return;
    const { error } = await supabaseBrowserClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // TODO: melhorar feedback com toast
      // eslint-disable-next-line no-alert
      alert("Credenciais inválidas ou erro de autenticação.");
      return;
    }

    router.replace("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-surface]">
      <div className="w-full max-w-sm border border-[--color-border] bg-[--color-bg] px-8 py-10">
        <div className="mb-8 space-y-2">
          <p
            className="text-xs uppercase tracking-[0.18em] text-[--color-text-muted]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Admin access
          </p>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sign in to portfolio backend
          </h1>
          <p className="text-xs text-[--color-text-muted]">
            Restricted area. Use the credentials configured in Supabase Auth.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              Senha
            </label>
            <input
              type="password"
              className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full border border-[--color-text-primary] bg-[--color-text-primary] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

