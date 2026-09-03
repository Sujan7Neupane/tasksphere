import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session?.user?.platformRole !== "ADMIN") {
    redirect("/user/dashboard");
  }

  return <>{children}</>;
};

export default AdminLayout;
