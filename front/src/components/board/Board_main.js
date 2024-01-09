
import React, { useState } from "react";
import classes from "./Board_main.module.css"
import Boardsidebar from "./Board_sidebar";
import Createboard from "./Create_board";
import Boardbody from "./Board_body";
import { Outlet } from "react-router-dom";

const Boardmain = () => {



    return (
        <>
            <main style={{ display: 'flex' }}>
                <Boardsidebar />
                <Outlet />
            </main>
        </>


    )
}
export default Boardmain