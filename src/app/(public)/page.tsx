import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { getProjetosPublicados } from "@/lib/db/queries";

export default async function HomePage() {
  const projetos = await getProjetosPublicados();

  return (
    <div className="space-y-10">
      <PortfolioGrid projetos={projetos} />
    </div>
  );
}
