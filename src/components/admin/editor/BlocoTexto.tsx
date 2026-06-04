"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Type } from "lucide-react";

interface BlocoTextoProps {
  id: string;
  conteudo: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function BlocoTexto({ id, conteudo, onChange, onRemove }: BlocoTextoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
            <Type size={14} />
            <span>Bloco de texto</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-[--color-text-muted] hover:text-[--color-text-primary]"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <textarea
          className="min-h-[120px] w-full resize-y border border-[--color-border] bg-[--color-bg] px-3 py-2 text-sm outline-none focus:border-[--color-text-primary]"
          placeholder="Escreva algo sobre este momento do projeto..."
          value={conteudo}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-[10px] text-[--color-text-muted]">
          Suporta texto simples. Estenda para Markdown ou rich text no futuro.
        </p>
      </div>
    </div>
  );
}

