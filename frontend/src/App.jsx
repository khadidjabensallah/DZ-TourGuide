import SignUpTourist from "./Routes/Auth/signupTourist";
import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
import { createBrowserRouter } from "react-router-dom";
import SelectType from "./Routes/Auth/selectType";
import Example from "./Layout/example";
import VerifyEmail from "./Routes/Auth/VerifyEmail";
import SignIn from "./Routes/Auth/signin";
import EnterEmailPass from "./Routes/Auth/EnterEmailPass";
import VerifyResetCode from "./Routes/Auth/VerifyResetCode";
import ResetPassword from "./Routes/Auth/ResetingPass";
import PasswordChangedPage from "./Routes/Auth/SuccessResetPass";
import HeroSection from "./Routes/HomePage/HeroSection";
import Rootlayout from "./Layout/Rootlayout";
import ToursSection from "./Routes/HomePage/ToursSection";
import TravelDestinations from "./Routes/HomePage/TravelDestinations";
import CreateNewTour from "./Routes/Tour/createTour";
import GuideProfileG from "./Routes/Guide/GuideProfile";
import EditProfile from "./Routes/Guide/editProfile";
import EditTour from "./Routes/Guide/editTour";
import TourDetail from "./Routes/Tour/TourDetails";
import SearchPage from "./Routes/HomePage/Serch";
import CustomTour from "./Routes/Tour/CustomTour";
// Admin Routes
import UserManagement from "./Routes/Admin/UserMgmt";
import AdminDashboard from "./Routes/Admin/Stats";
import AdminReports from "./Routes/Admin/Report";
import GuideValidation from "./Routes/Admin/PendGuide";

// Tourist Routes
import TouristProfile from "./Routes/tourist/Touristprofil";
import EditCustomTourPage from "./Routes/tourist/CustomTourEdit";

// Guide Routes
import MyGuideTours from "./Routes/Guide/GuideTours";
import GuideReportForm from "./Routes/Guide/Report";
import GuestProfile from "./Routes/Guide/GuideProfileU";
import GuideTouristView from "./Routes/Guide/GuideProfileT";
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
  { path: "/forgot-password", element: <EnterEmailPass /> },
  { path: "/verify-reset", element: <VerifyResetCode /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/password-changed", element: <PasswordChangedPage /> },
  { path: "/createtour", element: <CreateNewTour /> },
  { path: "/GuideProfileG", element: <GuideProfileG /> },
  { path: "/guide/:guideId/profile", element: <GuestProfile /> },
  { path: "/editProfile", element: <EditProfile /> },
  { path: "/editTour/:id", element: <EditTour /> },
  { path: "/tour/:id", element: <TourDetail /> },
  { path: "/searchPage", element: <SearchPage /> },
  { path: "/CustomTour", element: <CustomTour /> },

  // Admin Routes
  { path: "/admin/users", element: <UserManagement /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/reports", element: <AdminReports /> },
  { path: "/admin/guides-validation", element: <GuideValidation /> },

  // Tourist Routes
  { path: "/tourist/profile", element: <TouristProfile /> },
  { path: "/CustomTourEdit/:id", element: <EditCustomTourPage /> },

  // Guide Routes
  { path: "/guide/tours", element: <MyGuideTours /> },
  { path: "/guide/report-issue", element: <GuideReportForm /> },
  { path: "/guide/guest-view", element: <GuestProfile /> },
  { path: "/guide/tourist-view", element: <GuideTouristView /> }
]);