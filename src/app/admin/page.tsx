import Link from "next/link";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { getProjetosAdmin } from "@/lib/db/queries";

export default async function AdminDashboardPage() {
  const projetos = await getProjetosAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projetos
          </h1>
          <p className="text-sm text-[--color-text-muted]">
            Crie, organize e publique os projetos que aparecem no portfólio público.
          </p>
        </div>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center justify-center border border-[--color-text-primary] bg-[--color-text-primary] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-black"
        >
          Novo Projeto
        </Link>
      </div>

      <ProjectTable projetos={projetos} />
    </div>
  );
}