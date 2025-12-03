import Header from "./Layout/Header"
import SignUpTourist from "./Routes/Auth/signupTourist";
import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
import { createBrowserRouter } from "react-router-dom";
import SelectType from "./Routes/Auth/selectType";
import Example from "./Layout/example";
import VerifyEmail from "./Routes/Auth/VerifyEmail";
export const router = createBrowserRouter([
      {
        path: "/",
        element: <Header />,
      },
      {
        path: "/SignUpTourist",
        element: <SignUpTourist />,
      },
      {
        path: "/SignUpGuideP1",
        element: <SignUpGuideP1 />,
      },
      {
        path: "/SignUpGuideP2",
        element: <SignUpGuideP2 />,
      },
      {
        path: "/example",
        element: <Example />,
      },
      {
        path: "/selectType",
        element: <SelectType />,
      },
      {
        path: "/verifyEmail",
        element: <SelectType />,
      },
]);
