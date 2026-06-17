import { redirect } from "next/navigation";
import { getCurrentUser, getProfile } from "@/lib/app-data";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (!profile?.couple_id) {
    redirect("/setup");
  }

  redirect("/today");
}
