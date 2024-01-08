
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Boardmain from "./components/board/Board_main";
import Boardbody from "./components/board/Board_body";
import Cardmain from './components/card/Card_main'

const router= createBrowserRouter([
  {path : "/" , element : <Boardmain></Boardmain>,children :[
    {path : ":id/:title" ,element : <Boardbody></Boardbody>}
  ]},
  {path : "/card" ,element : <Cardmain></Cardmain>}
])

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
