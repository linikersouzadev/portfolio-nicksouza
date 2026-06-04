"use client";

import type { StatusProjeto } from "@/types";

interface StatusPublicacaoProps {
  status: StatusProjeto;
  onChange: (status: StatusProjeto) => void;
}

export function StatusPublicacao({ status, onChange }: StatusPublicacaoProps) {
  return (
    <section className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-[0.16em]">
        Status de publicação
      </label>
      <div className="inline-flex items-center gap-3 rounded-sm border border-[--color-border] bg-[--color-bg] px-3 py-2 text-xs">
        <button
          type="button"
          className={`px-2 py-1 uppercase tracking-[0.16em] ${
            status === "rascunho"
              ? "text-[--color-text-primary]"
              : "text-[--color-text-muted]"
          }`}
          onClick={() => onChange("rascunho")}
        >
          Rascunho
        </button>
        <span className="h-4 w-px bg-[--color-border]" />
        <button
          type="button"
          className={`px-2 py-1 uppercase tracking-[0.16em] ${
            status === "publicado"
              ? "text-[--color-text-primary]"
              : "text-[--color-text-muted]"
          }`}
          onClick={() => onChange("publicado")}
        >
          Publicado
        </button>
      </div>
    </section>
  );
}

