import React, {useState} from 'react';
import "./Login.css"
import axios from "axios";
import Game from "./Game";

const Login = () => {
    const [register, setRegister] = useState(false);
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [name , setName] = useState('');
    const [login, setLogin] = useState(false)
    const postData = async (evt) => {
        if (!register) {
            evt.preventDefault();
            try {
                const data = {
                    email: email,
                    password: password,
                }

               await axios.post('https://localhost:7182/api/Auth/login', data)
                   .then((response) => {
                       if(response.data.startsWith("wrong")){
                           setLogin(false);
                           alert("Email or Password incorrect")
                       }
                       else {
                           sessionStorage.setItem('token', response.data);
                           setLogin(true);
                       }
                   })
                   .catch((error => {
                       setLogin(false);
                       alert("Email or password incorrect")
                   }))
            } catch (error) {
                console.log(error);
                alert("Email or password incorrect")
            }
        }
        else
        {
            try {
                const data = {
                    name: name,
                    email: email,
                    password: password,
                }
                 await axios.post('https://localhost:7182/api/Auth/register', data)
                     .catch((error) => {
                         alert("User already exist")
                     })
            } catch (error) {
                console.log(error);
                window.location.reload();
            }
        }
    }

    return (

        <>
            {login === false ? <>
                {
                    (register) ?
                        <div>
                            <div className="login-box">
                                <h2>Register</h2>
                                <form onSubmit={postData}>
                                    <div className="user-box">
                                        <input onChange={(value) => setName(value.target.value)} name="Name" id="name" type="text" required/>
                                        <label>Name</label>
                                    </div>
                                    <div className="user-box">
                                        <input onChange={(value) => setEmail(value.target.value)} name="Email" id="email" type="email" required/>
                                        <label>Email</label>
                                    </div>
                                    <div className="user-box">
                                        <input onChange={(value) => setPassword(value.target.value)} id="password" type="password" required/>
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
                                        <p className="sub-register" onClick={()=> setRegister(false)}>Login</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="login-box">
                                <h2>Login</h2>
                                <form onSubmit={postData}>
                                    <div className="user-box">
                                        <input  name="Email" id="email" type="email" onChange={(value) => setEmail(value.target.value)} required/>
                                        <label>Email</label>
                                    </div>
                                    <div className="user-box">
                                        <input  name="Password" id="password" type="password" onChange={(value) => setPassword(value.target.value)} required/>
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
                                        <p className="sub-register" onClick={()=> setRegister(true)}>Register</p>
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