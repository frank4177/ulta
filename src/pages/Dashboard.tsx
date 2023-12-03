import Button from "../component/Button";
import { signOut } from "firebase/auth";
import { authentication } from "../configs/firebase-config";

const Dashboard = () => {
  const handleLogout = () => {
    signOut(authentication)
      .then(() => {
        // Sign-out successful.
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
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
