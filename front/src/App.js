
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Boardmain from "./components/board/Board_main";

const router= createBrowserRouter([
  {path : "/" , element : <Boardmain></Boardmain>}
  
])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
