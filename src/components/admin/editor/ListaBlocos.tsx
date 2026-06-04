"use client";

import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Bloco } from "@/types";
import { BlocoImagem } from "./BlocoImagem";
import { BlocoTexto } from "./BlocoTexto";

interface ListaBlocosProps {
  blocos: Bloco[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onRemove: (id: string) => void;
  onUpdateImagem: (
    id: string,
    url: string | null,
    estado: "idle" | "uploading" | "success" | "error",
  ) => void;
  onUpdateTexto: (id: string, conteudo: string) => void;
  onToggleDestaque: (id: string) => void;
}

export function ListaBlocos({
  blocos,
  onReorder,
  onRemove,
  onUpdateImagem,
  onUpdateTexto,
  onToggleDestaque,
}: ListaBlocosProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const ordered = [...blocos].sort((a, b) => a.ordem - b.ordem);
  const ids = ordered.map((b) => b.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(oldIndex, newIndex);
  };

  if (!ordered.length) {
    return (
      <div className="rounded-sm border border-dashed border-[--color-border] bg-[--color-surface] px-4 py-6 text-xs text-[--color-text-muted]">
        Nenhum bloco adicionado ainda. Comece com um bloco de imagem ou texto.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {ordered.map((bloco) =>
            bloco.tipo === "imagem" ? (
              <BlocoImagem
                key={bloco.id}
                bloco={bloco}
                onUploadComplete={(url, estado) =>
                  onUpdateImagem(bloco.id, url, estado)
                }
                onRemove={() => onRemove(bloco.id)}
                onToggleDestaque={() => onToggleDestaque(bloco.id)}
              />
            ) : (
              <BlocoTexto
                key={bloco.id}
                id={bloco.id}
                conteudo={bloco.conteudo}
                onChange={(value) => onUpdateTexto(bloco.id, value)}
                onRemove={() => onRemove(bloco.id)}
              />
            ),
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

