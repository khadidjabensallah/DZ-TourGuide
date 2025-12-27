// import SignUpTourist from "./Routes/Auth/signupTourist";
// import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
// import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
// import { createBrowserRouter } from "react-router-dom";
// import SelectType from "./Routes/Auth/selectType";
// import Example from "./Layout/example";
// import VerifyEmail from "./Routes/Auth/VerifyEmail";
// import SignIn from "./Routes/Auth/signin";
// import HeroSection from "./Routes/HomePage/HeroSection";
// import Rootlayout from "./Layout/Rootlayout";
// import ToursSection from "./Routes/HomePage/ToursSection";
// import TravelDestinations from "./Routes/HomePage/TravelDestinations";
// import CreateNewTour from "./Routes/Tour/createTour";
// import GuideProfileG from "./Routes/Guide/GuideprofileG";
// import EditProfile from "./Routes/Guide/editProfile";
// import EditTour from "./Routes/Guide/editTour";
// import TourDetail from "./Routes/Tour/TourDetails";
// import SearchPage from "./Routes/HomePage/Serch";
// import CustomTour from "./Routes/Tour/CustomTour";
// import GuideProfileT from "./Routes/Guide/GuideProfileT";
// import GuideProfileU from "./Routes/Guide/GuideProfileU";
// import GuideTours from "./Routes/Guide/GuideTours";
// export const router = createBrowserRouter([
//   {
//     path: "",
//     element: <Rootlayout />,
//     children: [
//       {
//         path: "/",
//         element: (
//           <>
//             <HeroSection />
//             <ToursSection />
//             <TravelDestinations />
//           </>
//         ),
//       },
//     ],
//   },
//   {
//     path: "",
//     element: <ProfileLayout />,
//     children: [
//       {
//         path: "/GuideProfileG",
//         element: (
//           <>
//             <GuideProfileG />
//           </>
//         ),
//       },
//       {
//         path: "/GuideTours",
//         element: (
//           <>
//             <GuideTours />
//           </>
//         ),
//       },
//     ],
//   },
//   { path: "/SignUpTourist", element: <SignUpTourist /> },
//   { path: "/SignUpGuideP1", element: <SignUpGuideP1 /> },
//   { path: "/SignUpGuideP2", element: <SignUpGuideP2 /> },
//   { path: "/example", element: <Example /> },
//   { path: "/selectType", element: <SelectType /> },
//   { path: "/verifyEmail", element: <VerifyEmail /> },
//   { path: "/signin", element: <SignIn /> },
//   { path: "/createtour", element: <CreateNewTour /> },
//   // { path: "/GuideProfileG", element: <GuideProfileG /> },
//   { path: "/editProfile", element: <EditProfile /> },
//   { path: "/editTour/:id", element: <EditTour /> },
//   { path: "/tour/:id", element: <TourDetail /> },
//   { path: "/searchPage", element: <SearchPage /> },
//   { path: "/CustomTour", element: <CustomTour /> },
//   { path: "/GuideProfileT", element: <GuideProfileT /> },
//   { path: "/GuideProfileU", element: <GuideProfileU /> },
//   // { path: "/GuideTours", element: <GuideTours /> },
// ]);
// ... imports remain the same ...

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpTourist from "./Routes/Auth/signupTourist";
import SignUpGuideP1 from "./Routes/Auth/signuoGuide/signupguideP1";
import SignUpGuideP2 from "./Routes/Auth/signuoGuide/signupguideP2";
import SelectType from "./Routes/Auth/selectType";
import Example from "./Layout/example";
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
import GuideTours from "./Routes/Guide/GuideTours";
import ProfileLayout from "./Layout/ProfileLayout";

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
    path: "example",
    element: <Example />,
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
]);

// If you have a main App component, make sure to use RouterProvider
function App() {
  return <RouterProvider router={router} />;
}

export default App;