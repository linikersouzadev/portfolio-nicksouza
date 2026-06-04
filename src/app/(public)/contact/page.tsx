"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(1, "Assunto é obrigatório"),
  message: z.string().min(20, "Mensagem muito curta — conte um pouco mais."),
  website: z.string().optional(), // honeypot
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setErroEnvio(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      if (response.status === 429) {
        setErroEnvio(
          payload?.error ??
            "Você enviou mensagens demais em pouco tempo. Tente novamente mais tarde.",
        );
      } else {
        setErroEnvio(payload?.error ?? "Erro ao enviar mensagem. Tente novamente.");
      }
      return;
    }

    setEnviado(true);
    reset();
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="space-y-3">
        <h1
          className="text-3xl font-semibold md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&apos;s talk.
        </h1>
        <p className="text-sm text-[--color-text-muted] md:text-base">
          For collaboration, commissions or studio work inquiries, send a short
          brief and preferred timeframe.
        </p>
      </div>

      {enviado ? (
        <div className="border border-[--color-border] bg-[--color-surface] px-5 py-6 text-sm">
          <p className="font-medium">Message sent.</p>
          <p className="mt-1 text-[--color-text-muted]">
            Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
          <button
            type="button"
            onClick={() => setEnviado(false)}
            className="mt-4 text-xs underline underline-offset-4 text-[--color-text-muted]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot: campo escondido para bots */}
          <div className="hidden">
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              Email
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

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              Subject
            </label>
            <input
              type="text"
              className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
              Message
            </label>
            <textarea
              rows={6}
              className="w-full border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          {erroEnvio && (
            <p className="text-xs text-red-500">{erroEnvio}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center border border-[--color-text-primary] bg-[--color-text-primary] px-6 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
