"use client";

import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, ImageIcon } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import type { BlocoImagem as BlocoImagemType } from "@/types";

interface BlocoImagemProps {
  bloco: BlocoImagemType;
  onUploadComplete: (url: string | null, estado: BlocoImagemType["estadoUpload"]) => void;
  onRemove: () => void;
  onToggleDestaque: () => void;
}

export function BlocoImagem({
  bloco,
  onUploadComplete,
  onRemove,
  onToggleDestaque,
}: BlocoImagemProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: bloco.id,
  });

  const { upload, estado, erro } = useUpload();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelectFile = async (file: File | null) => {
    if (!file) return;
    try {
      onUploadComplete(bloco.url, "uploading");
      const url = await upload(file, "blocos");
      onUploadComplete(url, "success");
    } catch {
      onUploadComplete(null, "error");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 border border-[--color-border] bg-[--color-bg]"
    >
      <button
        type="button"
        className="flex cursor-grab items-center justify-center border-r border-[--color-border] bg-[--color-surface] px-2"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} className="text-[--color-text-muted]" />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
            <ImageIcon size={14} />
            <span>Bloco de imagem</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDestaque}
              className={`flex items-center gap-1 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                bloco.destaque
                  ? "border-[--color-text-primary] text-[--color-text-primary]"
                  : "border-[--color-border] text-[--color-text-muted]"
              }`}
            >
              <Star size={12} fill={bloco.destaque ? "currentColor" : "none"} />
              Destaque
            </button>
            <button
              type="button"
              onClick={() => {
                if (bloco.url) {
                  // eslint-disable-next-line no-alert
                  const confirmed = window.confirm(
                    "Remover este bloco? A imagem já foi enviada.",
                  );
                  if (!confirmed) return;
                }
                onRemove();
              }}
              className="text-[--color-text-muted] hover:text-[--color-text-primary]"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1 overflow-hidden border border-[--color-border] bg-[--color-surface]">
            {bloco.url ? (
              <img
                src={bloco.url}
                alt="Imagem do bloco"
                className="h-full w-full max-h-80 object-cover"
              />
            ) : (
              <button
                type="button"
                className="flex h-40 w-full items-center justify-center text-xs text-[--color-text-muted]"
                onClick={() => inputRef.current?.click()}
              >
                Selecionar imagem
              </button>
            )}
          </div>

          <div className="w-full max-w-[160px] space-y-1 text-xs text-[--color-text-muted]">
            <p>
              Estado:{" "}
              <span className="font-mono">
                {estado === "idle" && "idle"}
                {estado === "uploading" && "uploading"}
                {estado === "success" && "success"}
                {estado === "error" && "error"}
              </span>
            </p>
            {erro && <p className="text-[10px] text-red-500">{erro}</p>}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

