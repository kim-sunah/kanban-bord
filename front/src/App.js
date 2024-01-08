
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Boardmain from "./components/board/Board_main";
import Boardbody from "./components/board/Board_body";
const router= createBrowserRouter([
  {path : "/" , element : <Boardmain></Boardmain>,children :[
    {path : ":id/:title" ,element : <Boardbody></Boardbody>}
  ]}
  
])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
