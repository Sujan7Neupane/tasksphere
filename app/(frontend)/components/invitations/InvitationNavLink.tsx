"use client";
import Link from "next/link";
import { useMyInvitations } from "../../../hooks/useInvitations";
const InvitationNavLink = () => {
  const { data: invitations } = useMyInvitations();
  const count = invitations?.length ?? 0;
  return (
    <Link href="/user/invitations" className="flex items-center gap-1">
      Invitations
      {count > 0 && (
        <span className="badge badge-secondary badge-sm"> {count} </span>
      )}
    </Link>
  );
};
export default InvitationNavLink;
