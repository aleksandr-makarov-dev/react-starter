import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "./pages/landing-page";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);

export function AppRouter() {
  return <RouterProvider router={createAppRouter()} />;
}
