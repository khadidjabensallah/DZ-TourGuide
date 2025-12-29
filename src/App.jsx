import { createBrowserRouter } from "react-router-dom";
import SignInPage from "./Routes/Auth/signin";
import CreateTour from "./Routes/Tour/CreateTour";
import EnterEmailPass from "./Routes/Auth/EnterEmailPass";
import SuccessResetPass from "./Routes/Auth/SuccessResetPass";
import ResetingPass from "./Routes/Auth/ResetingPass";
import VerifyEmailPass from "./Routes/Auth/Verifyemailpass";
import Report from "./Routes/Admin/Report";
import Stats from "./Routes/Admin/Stats";
import UserMgmt from "./Routes/Admin/UserMgmt";
import PendGuide from "./Routes/Admin/PendGuide";
export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/VerifyEmailPass",
    element: <VerifyEmailPass />,
  },
    {
    path: "/EnterEmailPass",
    element: <EnterEmailPass />,
  },
  {
    path: "/ResetingPass",
    element: <ResetingPass />,
  },
  {
    path: "/SuccessResetPass",
    element: <SuccessResetPass />,
  },
  {
    path: "/CreateTour",
    element: <CreateTour />,
  },
  {
    path: "/Report",
    element: <Report />,
  },
  {
    path: "/Stats",
    element: <Stats />,
  },
  {
    path: "/UserMgmt",
    element: <UserMgmt />,
  },
  {
      path: "/PendGuide",
      element: <PendGuide />,
    },
]);