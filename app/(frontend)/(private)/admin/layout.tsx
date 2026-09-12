import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session?.user?.platformRole !== "ADMIN") {
    redirect("/user/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">{children}</div>
  );
};

export default AdminLayout;
