import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = async () => {
  const session = await auth();

  if (session?.user) {
    if (session.user.isActive) {
      redirect("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
