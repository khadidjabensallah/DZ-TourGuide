import { createBrowserRouter } from "react-router-dom";
import SignInPage from "./Routes/Auth/signin";
import CreateTour from "./Routes/Tour/CreateTour";
import EnterEmailPass from "./Routes/Auth/EnterEmailPass";
import SuccessResetPass from "./Routes/Auth/SuccessResetPass";
import ResetingPass from "./Routes/Auth/ResetingPass";
import VerifyEmailPass from "./Routes/Auth/Verifyemailpass";
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
]);