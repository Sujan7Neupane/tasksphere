import { auth } from "../../../../../auth";

const Dashboard = async () => {
  const session = await auth();
  const email = session?.user?.email;
  const platformRole = session?.user.platformRole;
  return (
    <div>
      <h1>{`Welcome ${email}`}</h1>
      <h5>Role: {platformRole}</h5>
    </div>
  );
};

export default Dashboard;
