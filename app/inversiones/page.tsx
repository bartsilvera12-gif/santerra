import { getCategoryCards } from "@/lib/supabase/queries";
import InversionesContent from "./InversionesContent";


export default async function InversionesPage() {
  const cards = await getCategoryCards();
  return <InversionesContent categories={cards} />;
}
