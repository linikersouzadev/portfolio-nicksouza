"use client";

interface BotoesAcaoProps {
  podeGravar: boolean;
  podePrevisualizar: boolean;
  temAlteracoesNaoSalvas: boolean;
  onCancelar: () => void;
  onPrevisualizar: () => void;
  onGravar: () => Promise<void>;
}

export function BotoesAcao({
  podeGravar,
  podePrevisualizar,
  temAlteracoesNaoSalvas,
  onCancelar,
  onPrevisualizar,
  onGravar,
}: BotoesAcaoProps) {
  const handleCancelar = () => {
    if (temAlteracoesNaoSalvas) {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(
        "Tem certeza? As alterações serão perdidas.",
      );
      if (!confirmed) return;
    }
    onCancelar();
  };

  const handleGravar = async () => {
    if (!podeGravar) return;
    await onGravar();
  };

  return (
    <div className="sticky bottom-0 mt-6 border-t border-[--color-border] bg-[--color-surface]/95 py-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="text-xs text-[--color-text-muted]">
          {podeGravar
            ? "Pronto para gravar."
            : "Preencha título, descrição e thumbnail, e aguarde o fim dos uploads para gravar."}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCancelar}
            className="border border-[--color-border] bg-[--color-bg] px-4 py-2 text-xs uppercase tracking-[0.16em]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onPrevisualizar}
            disabled={!podePrevisualizar}
            className="border border-[--color-border] bg-[--color-bg] px-4 py-2 text-xs uppercase tracking-[0.16em] disabled:text-[--color-text-muted]"
          >
            Pré-visualizar
          </button>
          <button
            type="button"
            onClick={handleGravar}
            disabled={!podeGravar}
            className="border border-[--color-text-primary] bg-[--color-text-primary] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white disabled:border-[--color-border] disabled:bg-[--color-border] disabled:text-[--color-text-muted]"
          >
            Gravar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}

