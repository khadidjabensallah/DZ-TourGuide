import SignUpTourist from "./Routes/Auth/signupTourist";
import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
import { createBrowserRouter } from "react-router-dom";
import SelectType from "./Routes/Auth/selectType";
import Example from "./Layout/example";
import VerifyEmail from "./Routes/Auth/VerifyEmail";
import SignIn from "./Routes/Auth/signin";
import HeroSection from "./Routes/HomePage/HeroSection";
import Rootlayout from "./Layout/Rootlayout";
import ToursSection from "./Routes/HomePage/ToursSection";
import TravelDestinations from "./Routes/HomePage/TravelDestinations";
export const router = createBrowserRouter([
  {
    path: "",
    element: <Rootlayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <ToursSection />
            <TravelDestinations />
          </>
        ),
      },
    ],
  },
  { path: "/SignUpTourist", element: <SignUpTourist /> },
  { path: "/SignUpGuideP1", element: <SignUpGuideP1 /> },
  { path: "/SignUpGuideP2", element: <SignUpGuideP2 /> },
  { path: "/example", element: <Example /> },
  { path: "/selectType", element: <SelectType /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signin", element: <SignIn /> },
]);
