import { auth } from "../../../../../auth";

import UserDashboard from "../../../components/dashboard/UserDashboard";

const Dashboard = async () => {
  const session = await auth();

  return (
    <UserDashboard
      userName={session?.user?.name || ""}
      userEmail={session?.user?.email || ""}
    />
  );
};

export default Dashboard;
