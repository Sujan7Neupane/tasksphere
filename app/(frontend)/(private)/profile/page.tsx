import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "../../components/auth/ProfileForm";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="mb-6 w-full max-w-md">
        <Link
          href="/user/dashboard"
          className="mb-4 inline-block text-sm text-base-content/60 hover:text-base-content"
        >
          ← Back
        </Link>

        <h1 className="text-2xl font-bold">Profile</h1>

        <p className="mt-1 text-sm text-base-content/60">
          Manage your profile information.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
