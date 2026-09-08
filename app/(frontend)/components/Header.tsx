import Link from "next/link";
import { logoutUser } from "../actions/auth.actions";
import { auth } from "../../../auth";
import ProfileMenu from "./auth/ProfileMenu";
import InvitationNavLink from "./invitations/InvitationNavLink";

const Header = async () => {
  const session = await auth();
  // console.log(session);

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

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={
              session?.user.platformRole === "ADMIN"
                ? "/admin/dashboard"
                : "/user/dashboard"
            }
          >
            Dashboard
          </Link>

          {session?.user.platformRole !== "ADMIN" && <InvitationNavLink />}

          <Link
            href={
              session?.user.platformRole === "ADMIN"
                ? "/admin/workspaces"
                : "/user/workspaces"
            }
          >
            Workspaces
          </Link>
          <Link href="/profile">Profile</Link>

          <div className="divider divider-horizontal mx-1" />

          <div>
            <ProfileMenu />
          </div>

          <div className="divider divider-horizontal mx-1" />

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

            {session?.user.platformRole !== "ADMIN" && (
              <li>
                <InvitationNavLink />
              </li>
            )}

            <li>
              <Link
                href={
                  session?.user.platformRole === "ADMIN"
                    ? "/admin/workspaces"
                    : "/user/workspaces"
                }
              >
                Workspaces
              </Link>
            </li>

            <li>
              <Link href="/profile">Profile</Link>
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
