import { useDispatch } from "react-redux";
import { logout } from "../services/redux/features/userSlice";
import Button from "./Button";

const Navbar = () => {
  const dispatch = useDispatch();

  // Handle logout function
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };
  return (
    <nav className="navbar">
      <Button title="Logout" handleClick={handleLogout} />
    </nav>
  );
};

export default Navbar;
