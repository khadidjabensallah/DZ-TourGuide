import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpTourist from "./Routes/Auth/signupTourist";
import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
import SelectType from "./Routes/Auth/selectType";
import VerifyEmail from "./Routes/Auth/VerifyEmail";
import SignIn from "./Routes/Auth/signin";
import HeroSection from "./Routes/HomePage/HeroSection";
import Rootlayout from "./Layout/Rootlayout";
import ToursSection from "./Routes/HomePage/ToursSection";
import TravelDestinations from "./Routes/HomePage/TravelDestinations";
import CreateNewTour from "./Routes/Tour/createTour";
import GuideProfileG from "./Routes/Guide/GuideProfileG";
import EditProfile from "./Routes/Guide/editProfile";
import EditTour from "./Routes/Guide/editTour";
import TourDetail from "./Routes/Tour/TourDetails";
import SearchPage from "./Routes/HomePage/Serch";
import CustomTour from "./Routes/Tour/CustomTour";
import GuideProfileT from "./Routes/Guide/GuideProfileT";
import GuideProfileU from "./Routes/Guide/GuideProfileU";
import TouristProfile from "./Routes/Tourist/TouristProfile";
import GuideTours from "./Routes/Guide/GuideTours";
import ProfileLayout from "./Layout/ProfileLayout";
import Report from "./Routes/Guide/Report";
import CustomTourEdit from "./Routes/Tourist/CustomTourEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      {
        index: true,
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
  {
    path: "/",
    element: <ProfileLayout />,
    children: [
      {
        path: "GuideProfileG",
        element: <GuideProfileG />,
      },
      {
        path: "GuideTours",
        element: <GuideTours />,
      },
      {
        path: "editProfile",
        element: <EditProfile />,
      },
      {
        path: "editTour/:id",
        element: <EditTour />,
      },
      {
        path: "CreateTour",
        element: <CreateNewTour />,
      },
    ],
  },
  {
    path: "SignUpTourist",
    element: <SignUpTourist />,
  },
  {
    path: "SignUpGuideP1",
    element: <SignUpGuideP1 />,
  },
  {
    path: "SignUpGuideP2",
    element: <SignUpGuideP2 />,
  },
  {
    path: "selectType",
    element: <SelectType />,
  },
  {
    path: "verifyEmail",
    element: <VerifyEmail />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "tour/:id",
    element: <TourDetail />,
  },
  {
    path: "searchPage",
    element: <SearchPage />,
  },
  {
    path: "CustomTour",
    element: <CustomTour />,
  },
  {
    path: "GuideProfileT",
    element: <GuideProfileT />,
  },
  {
    path: "GuideProfileU",
    element: <GuideProfileU />,
  },
  {
    path: "Report",
    element: <Report />,
  },
  {
    path: "CustomTourEdit/:id", 
    element: <CustomTourEdit />,
  },
  {
    path: "touristprofile",
    element: <TouristProfile />,
  },
]);
