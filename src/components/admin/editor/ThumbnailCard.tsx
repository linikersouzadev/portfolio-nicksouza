"use client";

import { useRef } from "react";
import { useUpload } from "@/hooks/useUpload";

interface ThumbnailCardProps {
  url: string | null;
  onUploaded: (url: string) => void;
}

export function ThumbnailCard({ url, onUploaded }: ThumbnailCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, estado, erro } = useUpload();

  const handleSelectFile = async (file: File | null) => {
    if (!file) return;
    try {
      const uploadedUrl = await upload(file, "thumbnails");
      onUploaded(uploadedUrl);
    } catch {
      // erro já tratado pelo hook
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.16em]">
            Thumbnail do Card *
          </label>
          <p className="mt-1 max-w-md text-xs text-[--color-text-muted]">
            Esta imagem representa o projeto na listagem do portfólio — não aparece
            dentro do conteúdo do projeto. Proporção sugerida: 16:9 ou 4:3.
          </p>
        </div>
        <button
          type="button"
          className="text-xs uppercase tracking-[0.16em] underline underline-offset-4"
          onClick={() => inputRef.current?.click()}
        >
          {url ? "Substituir" : "Enviar imagem"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
      />

      <div className="mt-2 flex items-center gap-4">
        <div className="h-[160px] w-[280px] overflow-hidden border border-[--color-border] bg-[--color-surface]">
          {url ? (
            <img
              src={url}
              alt="Thumbnail do card"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[--color-text-muted]">
              Nenhuma imagem selecionada
            </div>
          )}
        </div>

        <div className="text-xs text-[--color-text-muted]">
          {estado === "uploading" && <p>Enviando imagem…</p>}
          {estado === "success" && <p>Upload concluído.</p>}
          {estado === "error" && <p className="text-red-500">{erro}</p>}
        </div>
      </div>
    </section>
  );
}

