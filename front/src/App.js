
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Boardmain from "./components/board/Board_main";
import Boardbody from "./components/board/Board_body";
import SignUp from "./components/signUp/signUp";
import SignIn from "./components/signIn/signIn";
import Login from "./components/auth/Login";
const router = createBrowserRouter([
  {
    path: "/", element: <Boardmain></Boardmain>, children: [
      { path: ":id/:title", element: <Boardbody></Boardbody> },
    ]
  },
  { path: "login", element: <Login></Login> },
  {
    path: "signUp", children: [
      { index: true, element: <SignIn></SignIn> },
      { path: "Signup", element: <SignUp></SignUp> }
    ]
  },

])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
