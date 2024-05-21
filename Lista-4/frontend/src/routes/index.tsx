import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/login";
import { Logout } from "../pages/logout";
import { Game } from '../pages/game';
import { Home } from "../pages/home";
import { GamesList } from "../pages/games-list";
import { Register } from "../pages/register";
import { ConfirmRegister } from "../pages/confirm-register";

export const Routes = () => {
  const { token } = useAuth() as { token: string };

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Home />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "games-list",
          element: <GamesList />,
        },
        {
          path: "/game/:id",
          element: <Game />,
        },
        {
          path: "/logout",
          element: <Logout/>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/confirm-register",
      element: <ConfirmRegister/>,
    },
    {
      path: "/register",
      element: <Register/>,
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

