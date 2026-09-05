"use client";

import Link from "next/link";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const ProfileMenu = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="h-10 w-10 rounded-full skeleton" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-300 font-semibold">
          {user.name?.[0]?.toUpperCase()}
        </div>
      )}

      <div>
        <p className="text-sm font-medium">{user.name}</p>

        <Link
          href="/profile"
          className="text-xs text-base-content/60 hover:text-base-content"
        >
          Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileMenu;
