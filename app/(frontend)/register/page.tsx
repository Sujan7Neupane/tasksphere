import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = async () => {
  const session = await auth();

  if (session?.user) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
