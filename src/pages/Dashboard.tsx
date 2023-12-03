import Button from "../component/Button/Button";
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
        // An error happened.
        console.log(error);
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
