import { auth } from "@/auth";
import { redirect } from "next/navigation";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.platformRole !== "USER") {
    redirect("/admin/dashboard");
  }

  return <>{children}</>;
};

export default UserLayout;
