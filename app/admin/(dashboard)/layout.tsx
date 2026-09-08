import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
