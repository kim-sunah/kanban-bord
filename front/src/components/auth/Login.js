import React, { useState, useRef } from 'react';
import { MDBContainer, MDBTabs, MDBTabsItem, MDBTabsLink, MDBBtn, MDBInput } from 'mdb-react-ui-kit';

import { useNavigate } from 'react-router-dom';
import classes from "./Login.module.css"

const Login = () => {
    const [justifyActive, setJustifyActive] = useState('tab1');
    const [signerror, setsignerror] = useState()
    const [loginerror, setloginerror] = useState();

    const Signusername = useRef();
    const Signemail = useRef();
    const Signpassword = useRef();
    const SignConfirmpassword = useRef();
    const loginemail = useRef();
    const loginpassword = useRef();
    const navigate = useNavigate()
    let session = window.sessionStorage


    const signsubmithandler = (event) => {

        event.preventDefault();

        fetch("http://54.180.109.210/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: Signemail.current.value, name: Signusername.current.value, password: Signpassword.current.value, passwordCheck: SignConfirmpassword.current.value })
        })
            .then(res => res.json()).then(resData => {
                if (resData.success === false) {
                    setsignerror(resData.message)
                } else if (resData.success === true) {
                    setJustifyActive("tab1")
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const loginsubmithandler = (event) => {
        event.preventDefault();
        fetch("http://54.180.109.210/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginemail.current.value, password: loginpassword.current.value }) })
            .then(res => res.json())
            .then(resData => {
                session.setItem("access_token", resData.access_token)
                navigate("/")
            }).catch(err => {
                console.log(err);
            })
    }

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }
        setJustifyActive(value);
    };

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            {justifyActive === "tab1" && <form onSubmit={loginsubmithandler}>

                <div className="text-center mb-3">




                </div>
                {loginerror && <p className={classes.error}>{loginerror}</p>}
                <MDBInput wrapperClass='mb-4' label='Email address' type='email' ref={loginemail} />
                <MDBInput wrapperClass='mb-4' label='Password' type='password' ref={loginpassword} />
                <MDBBtn className="mb-4 w-100" type='submit'>Sign in</MDBBtn>
            </form>}

            {justifyActive === "tab2" && <form onSubmit={signsubmithandler}>
                {signerror && <p className={classes.error}> {signerror} </p>}
                <MDBInput wrapperClass='mb-4' label='NickName' type='text' ref={Signusername} />
                <MDBInput wrapperClass='mb-4' label='Email' type='email' ref={Signemail} />
                <MDBInput wrapperClass='mb-4' label='Password' type='password' ref={Signpassword} />
                <MDBInput wrapperClass='mb-4' label='Password' type='password' ref={SignConfirmpassword} />
                <MDBBtn className="mb-4 w-100" type='submit'>Sign up</MDBBtn>
            </form>}
        </MDBContainer>
    );
}
export default Login