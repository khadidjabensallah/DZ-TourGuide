import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "../context/AuthContext";

export default function Rootlayout() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </AuthProvider>
  );
}
