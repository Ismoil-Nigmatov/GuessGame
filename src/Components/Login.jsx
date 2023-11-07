import React, {useState} from 'react';
import "./Login.css"
import axios from "axios";
import Game from "./Game";
import {toast, Toaster} from "alert";

const Login = () => {
    const [register, setRegister] = useState(false);
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [name , setName] = useState('');
    const [login, setLogin] = useState(false)
    const [emailError, setEmailError] = useState('');
    const postData = async (evt) => {
        if (!register) {
            evt.preventDefault();
            const data = {
                email: email,
                password: password,
            }
            if(emailError !== ''){
                toast(emailError)
            }
            else {
                toast("Please , wait!")
                await axios.post(`${process.env.REACT_APP_API_URL}/api/Auth/login`, data)
                    .then((response) => {
                        if (response.data.startsWith("wrong")) {
                            setLogin(false);
                            toast("Email or Password incorrect")
                        } else {
                            sessionStorage.setItem('token', response.data);
                            setLogin(true);
                        }
                    })
                    .catch((error => {
                        setLogin(false);
                        if (error.message === 'Network Error') {
                            toast(error.message);
                        }
                        else {
                            if (error.response.status === 400) {
                                toast("Email or password incorrect");
                            }
                        }
                    }))
            }
        } else {
            evt.preventDefault();
            const data = {
                name: name,
                email: email,
                password: password,
            }
            validateEmail();
            if (emailError !== '') {
                toast(emailError)
            } else {
                toast("Please , wait!")
                await axios.post(`${process.env.REACT_APP_API_URL}/api/Auth/register`, data)
                    .then(response => {
                        toast("User successfully registered");
                        setEmail('');
                        setPassword('');
                        setRegister(false);
                    })
                    .catch(error => {
                        if (error.message === 'Network Error') {
                            toast(error.message);
                        }
                        else {
                            if (error.response.status === 400) {
                                toast("User already exists")
                            }
                        }
                    })
            }
        }
    }

    function validateEmail() {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if(email === ''){
            setEmailError('');
        }
        else {
            if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        }
    }

    function handleLogin(value){
        setRegister(value);
        setName('');
        setEmail('');
        setPassword('');
        setEmailError('')
    }

    return (

        <>
            {login === false ? <>
                {
                    (register) ?
                        <div>
                            <div>
                                <Toaster/>
                            </div>
                            <div className="login-box">
                                <h2>Register</h2>
                                <form onSubmit={postData}>
                                    <div className="user-box">
                                        <input
                                            onChange={(value) => setName(value.target.value)}
                                            name="Name"
                                            id="name"
                                            type="text"
                                            required
                                            value={name}
                                        />
                                        <label>Name</label>
                                    </div>
                                    <div className="user-box">
                                        <input
                                            onChange={(value) => setEmail(value.target.value)}
                                            name="Email"
                                            id="email"
                                            type="email"
                                            onBlur={validateEmail}
                                            required
                                            value={email}
                                        />
                                        {emailError && <p className="text-danger">{emailError}</p>}
                                        <label>Email</label>
                                    </div>
                                    <div className="user-box">
                                        <input
                                            onChange={(value) => setPassword(value.target.value)}
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                        />
                                        <label>Password</label>
                                    </div>
                                    <a>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <button type="submit" className="login-btn">Register</button>
                                    </a>
                                    <div className="sub">
                                        <p>Have an account ?</p>
                                        <p className="sub-register" onClick={()=> handleLogin(false)}>Login</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                        :
                        <div>
                            <div>
                                <Toaster/>
                            </div>
                            <div className="login-box">
                                <h2>Login</h2>
                                <form onSubmit={postData}>
                                    <div className="user-box">
                                        <input
                                            name="Email"
                                            id="email"
                                            type="email"
                                            onChange={(value) => setEmail(value.target.value)}
                                            onBlur={validateEmail}
                                            required
                                            value={email}
                                        />
                                        {emailError && <p className="text-danger">{emailError}</p>}
                                        <label>Email</label>
                                    </div>
                                    <div className="user-box">
                                        <input
                                            name="Password"
                                            id="password"
                                            type="password"
                                            onChange={(value) => setPassword(value.target.value)}
                                            required
                                            value={password}
                                        />
                                        <label>Password</label>
                                    </div>
                                    <a>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <button type="submit" className="login-btn" >Login</button>
                                    </a>
                                    <div className="sub">
                                        <p>Don't have an account ?</p>
                                        <p className="sub-register" onClick={()=> handleLogin(true)}>Register</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                }</> : <>
                <Game/>
            </>}
        </>
    );
};

export default Login;