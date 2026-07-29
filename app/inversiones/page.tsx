import { getCategoryCards } from "@/lib/supabase/queries";
import InversionesContent from "./InversionesContent";

export const revalidate = 60;

export default async function InversionesPage() {
  const cards = await getCategoryCards();
  return <InversionesContent categories={cards} />;
}
