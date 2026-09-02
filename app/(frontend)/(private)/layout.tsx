import { auth } from "@/auth";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default PrivateLayout;
