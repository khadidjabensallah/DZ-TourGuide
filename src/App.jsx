import Header from "./Layout/Header"
import { createBrowserRouter } from "react-router-dom";
import Example from "./Layout/example";
export const router = createBrowserRouter([
      {
        path: "/",
        element: <Header />,
      },
      {
        path: "/example",
        element: <Example />,
      },
]);
