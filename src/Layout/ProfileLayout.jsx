import { Outlet } from "react-router-dom";
import HeaderProfile from "./HeaderProfile";
import { AuthProvider } from "../context/AuthContext";

export default function ProfileLayout() {
  return (
    <AuthProvider>
      <div>
        <HeaderProfile />
        <Outlet />
      </div>
    </AuthProvider>
  );
}
