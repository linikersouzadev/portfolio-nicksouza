"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Projeto } from "@/types";
import { deleteProjetoAction } from "@/app/admin/actions";

interface ProjectTableProps {
  projetos: Projeto[];
}

export function ProjectTable({ projetos: projetosIniciais }: ProjectTableProps) {
  const [projetos, setProjetos] = useState(projetosIniciais);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleExcluir = (projeto: Projeto) => {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${projeto.titulo}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    setDeletandoId(projeto.id);

    startTransition(async () => {
      const result = await deleteProjetoAction(projeto.id);

      if (!result.ok) {
        alert(result.error ?? "Erro ao excluir projeto. Tente novamente.");
        setDeletandoId(null);
        return;
      }

      // Remove da lista local imediatamente — sem precisar de refresh
      setProjetos((atual) => atual.filter((p) => p.id !== projeto.id));
      setDeletandoId(null);
    });
  };

  if (!projetos.length) {
    return (
      <div className="rounded-sm border border-dashed border-[--color-border] bg-[--color-surface] px-4 py-6 text-sm text-[--color-text-muted]">
        Nenhum projeto criado ainda. Clique em &quot;Novo Projeto&quot; para começar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[--color-border] bg-[--color-bg]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[--color-border] bg-[--color-surface]">
          <tr className="text-xs uppercase tracking-[0.16em] text-[--color-text-muted]">
            <th className="px-4 py-3 font-normal">Projeto</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Atualizado em</th>
            <th className="px-4 py-3 font-normal text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {projetos.map((projeto) => (
            <tr key={projeto.id} className="border-b border-[--color-border]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 overflow-hidden border border-[--color-border] bg-[--color-surface]">
                    <img
                      src={projeto.thumbnailCard}
                      alt={projeto.titulo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{projeto.titulo}</p>
                    <p className="line-clamp-1 text-xs text-[--color-text-muted]">
                      {projeto.descricao}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
                    projeto.status === "publicado"
                      ? "badge-publicado"
                      : "badge-rascunho"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {projeto.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-[--color-text-muted]">
                {projeto.atualizadoEm.toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right text-xs">
                <Link
                  href={`/admin/projetos/${projeto.id}/editar`}
                  className="mr-3 underline underline-offset-4"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  disabled={deletandoId === projeto.id || isPending}
                  className="text-red-400 underline underline-offset-4 disabled:opacity-40"
                  onClick={() => handleExcluir(projeto)}
                >
                  {deletandoId === projeto.id ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}