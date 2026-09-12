import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  // console.log(session);

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.isActive) {
    redirect("/login?error=AccountDisabled");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
