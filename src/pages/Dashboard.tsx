import Button from "../component/Button";
import { useDispatch } from "react-redux";
import { logout } from "../services/redux/features/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };
  return (
    <>
      <div className="dashboard">
        <h2>WELCOME TO THE DASHBOARD</h2>
        <Button title="Logout" handleClick={handleLogout} />
      </div>
    </>
  );
};

export default Dashboard;
