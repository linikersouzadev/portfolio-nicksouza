import { notFound } from "next/navigation";
import { EditarProjetoPage } from "@/components/admin/editor/EditarProjetoPage";
import { getProjetoComBlocosAdmin } from "@/lib/db/queries";

interface EditarProjetoRotaProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProjetoRota({
  params,
}: EditarProjetoRotaProps) {
  const { id } = await params;
  const projeto = await getProjetoComBlocosAdmin(id);

  if (!projeto) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <EditarProjetoPage projeto={projeto} />
    </div>
  );
}

