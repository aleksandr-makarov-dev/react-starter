import { AppProvider } from "@/context/provider";
import { createBrowserRouter, RouterProvider } from "react-router";
import { paths } from "@/config/paths";
import { lazy } from "react";

const LandingPage = lazy(() => import("./pages/landing"));

const createRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <LandingPage />,
    },
  ]);

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={createRouter()} />
    </AppProvider>
  );
}
