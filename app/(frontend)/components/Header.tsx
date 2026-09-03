import Link from "next/link";
import { logoutUser } from "../actions/auth.actions";
import { auth } from "../../../auth";

const Header = async () => {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 bg-base-100/95 shadow-md backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            TaskSphere
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={
              session?.user.platformRole === "ADMIN"
                ? "/admin/dashboard"
                : "/user/dashboard"
            }
          >
            Dashboard
          </Link>

          <Link href="/workspaces" className="btn btn-ghost btn-sm">
            Workspaces
          </Link>

          <div className="divider divider-horizontal mx-1" />

          <button className="btn btn-ghost btn-circle">
            <div className="avatar placeholder">
              <div className="w-9 rounded-full bg-primary text-primary-content flex justify-center items-center">
                <span>U</span>
              </div>
            </div>
          </button>

          <form action={logoutUser}>
            <button
              type="submit"
              className="btn btn-error btn-outline btn-sm cursor-pointer"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="dropdown dropdown-end md:hidden">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <ul
            tabIndex={0}
            className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <Link
                href={
                  session?.user.platformRole === "ADMIN"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link href="/workspaces">Workspaces</Link>
            </li>

            <li>
              <form action={logoutUser}>
                <button type="submit" className="text-error cursor-pointer">
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
