"use client";

import type { Projeto } from "@/types";
import { useState } from "react";
import { PreviewCard } from "./PreviewCard";
import { PreviewPaginaProjeto } from "./PreviewPaginaProjeto";

interface ModoPreviewProps {
  projetoPreview: Projeto;
  onClose: () => void;
  onGravarEPublicar: () => Promise<void>;
}

type Aba = "card" | "pagina";

export function ModoPreview({
  projetoPreview,
  onClose,
  onGravarEPublicar,
}: ModoPreviewProps) {
  const [aba, setAba] = useState<Aba>("card");
  const [saving, setSaving] = useState(false);

  const handleGravarEPublicar = async () => {
    setSaving(true);
    try {
      await onGravarEPublicar();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[--color-overlay]">
      <header className="border-b border-[--color-border] bg-[--color-bg] px-6 py-3 text-xs md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p
              className="text-xs uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Você está em modo de preview — as alterações ainda não foram salvas
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[--color-border] bg-[--color-bg] px-4 py-1.5 text-xs uppercase tracking-[0.16em]"
            >
              ← Voltar à edição
            </button>
            <button
              type="button"
              onClick={handleGravarEPublicar}
              disabled={saving}
              className="border border-[--color-text-primary] bg-[--color-text-primary] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white disabled:opacity-60"
            >
              {saving ? "Gravando..." : "Gravar e publicar"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 py-4 md:px-10 md:py-6">
        <div className="flex gap-4 text-xs uppercase tracking-[0.16em]">
          <button
            type="button"
            className={`border-b px-2 py-1 ${
              aba === "card"
                ? "border-[--color-text-primary] text-[--color-text-primary]"
                : "border-transparent text-[--color-text-muted]"
            }`}
            onClick={() => setAba("card")}
          >
            Card no portfólio
          </button>
          <button
            type="button"
            className={`border-b px-2 py-1 ${
              aba === "pagina"
                ? "border-[--color-text-primary] text-[--color-text-primary]"
                : "border-transparent text-[--color-text-muted]"
            }`}
            onClick={() => setAba("pagina")}
          >
            Página do projeto
          </button>
        </div>

        <div className="flex-1 overflow-auto pb-6">
          {aba === "card" ? (
            <div className="flex justify-center pt-6">
              <PreviewCard projeto={projetoPreview} />
            </div>
          ) : (
            <PreviewPaginaProjeto projeto={projetoPreview} />
          )}
        </div>
      </div>
    </div>
  );
}

