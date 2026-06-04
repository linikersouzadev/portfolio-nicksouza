"use client";

interface BotaoAdicionarBlocoProps {
  onAddImagem: () => void;
  onAddTexto: () => void;
  totalImagens: number;
  limiteImagens: number;
}

export function BotaoAdicionarBloco({
  onAddImagem,
  onAddTexto,
  totalImagens,
  limiteImagens,
}: BotaoAdicionarBlocoProps) {
  const atingiuLimite = totalImagens >= limiteImagens;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAddImagem}
          disabled={atingiuLimite}
          className="border border-[--color-text-primary] bg-[--color-bg] px-3 py-1.5 text-xs uppercase tracking-[0.16em] disabled:border-[--color-border] disabled:text-[--color-text-muted]"
        >
          + Adicionar imagem
        </button>
        <button
          type="button"
          onClick={onAddTexto}
          className="border border-[--color-border] bg-[--color-bg] px-3 py-1.5 text-xs uppercase tracking-[0.16em]"
        >
          + Adicionar texto
        </button>
      </div>
      {atingiuLimite && (
        <p className="text-xs text-[--color-text-muted]">
          Limite de 6 imagens atingido.
        </p>
      )}
    </div>
  );
}

