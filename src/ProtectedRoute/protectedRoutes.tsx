import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../services/redux/store";

interface IComponentProp {
  Component: () => JSX.Element
}

const ProtectedRoutes = ({Component}: IComponentProp) => {
  const auth = useSelector((state: RootState) => state?.user?.value);


    return auth ? <Component/> : <Navigate to="/" />
}

export default ProtectedRoutes