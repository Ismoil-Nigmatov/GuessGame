import React, {createRef, useState} from 'react';
import {toast, Toaster} from "alert";
import axios from "axios";
import './Game.css'
import Leaderboard from "./Leaderboard";
import * as Bootstrap from "bootstrap";


const Game = () => {
    const [step , setStep] = useState(8);
    const [width, setWidth] = useState(100);
    const [array , setArray]  = useState([])
    const [start , setStart] = useState(false);
    const [leader , setLeader] = useState(false);
    const [result , setResult] = useState('');
    const [header , setHeader] = useState('');
    const [inputValues, setInputValues] = useState({
        input1: "",
        input2: "",
        input3: "",
        input4: "",
    });

    const inputRefs = {
        input1: createRef(),
        input2: createRef(),
        input3: createRef(),
        input4: createRef(),
    };

    const handleInputChange = (e, inputName) => {
        const {value} = e.target;
        if (/^\d*$/.test(value)) {
            setInputValues({...inputValues, [inputName]: value});
            if (value !== "") {
                const nextInputName = `input${parseInt(inputName.slice(-1)) + 1}`;
                if (inputRefs[nextInputName]) {
                    inputRefs[nextInputName].current.focus();
                }
            }
        }
        else {
            toast("Please enter only digits")
        }
    };


    const handleKeyDown = (e, inputName) => {
        if (e.key === "Backspace" && e.target.value === "") {
            const prevInputName = `input${parseInt(inputName.slice(-1)) - 1}`;
            if (inputRefs[prevInputName]) {
                inputRefs[prevInputName].current.focus();
            }
        } else if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            const nextInputName = `input${parseInt(inputName.slice(-1)) + 1}`;
            if (inputRefs[nextInputName]) {
                inputRefs[nextInputName].current.focus();
            }
        } else if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            const prevInputName = `input${parseInt(inputName.slice(-1)) - 1}`;
            if (inputRefs[prevInputName]) {
                inputRefs[prevInputName].current.focus();
            }
        }
    };

    const StartGame = async ()=>{
        const token = sessionStorage.getItem('token');
        setWidth(100);
        setStep(8)
        const newInputValues = {
            input1: "",
            input2: "",
            input3: "",
            input4: "",
        };
        setInputValues(newInputValues);

        const newArray = [];
        setArray(newArray);

        await axios.get(`${process.env.REACT_APP_API_URL}/api/Game`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
            .then(response => {
                const startIndex = response.data.indexOf("Your session ID is:");
                const extractedMessage = response.data.substring(0, startIndex);
                const parts = response.data.split(':');
                const sessionId = parts[parts.length - 1].trim();
                sessionStorage.setItem('sessionId' , sessionId);
                toast(extractedMessage);
            })
            .catch(error => {
                console.log(error);
            })

        const inp = document.querySelectorAll("input");
        const button = document.querySelector(".guess-btn");
        inp.forEach(input => {
            input.removeAttribute("readOnly");
        });
        button.setAttribute("type", 'submit');
        setStart(true);
    }

    function submit(evt){
        evt.preventDefault();
        const token = sessionStorage.getItem('token');
        const userInput = `${inputValues.input1}${inputValues.input2}${inputValues.input3}${inputValues.input4}`
        if(hasTwoOrMoreSameDigits(userInput)){
            toast("The input contains 2 or more of the same digits.")
        }
        else {
            const newInputValues = {
                input1: "",
                input2: "",
                input3: "",
                input4: "",
            };
            setInputValues(newInputValues);
            const sessionId = sessionStorage.getItem('sessionId')
            const apiUrl = `${process.env.REACT_APP_API_URL}/api/Game/guess/${sessionId}?userInput=${userInput}`
            axios.post(apiUrl, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    toast(response.data);
                    setArray([...array, `${userInput} -> ` + response.data])
                    setWidth((prevWidth) => (prevWidth > 12.5 ? prevWidth - 12.5 : 0));
                    if(response.data.startsWith('Congratulations!')){
                        setStep(8);
                        const inp = document.querySelectorAll("input");
                        const button = document.querySelector(".guess-btn");
                        inp.forEach(input => {
                            input.setAttribute("readOnly", "Нет");
                        });
                        button.setAttribute("type", "button");
                        setResult('bg-success');
                        setHeader("Well , Done!")
                        const modal = new Bootstrap.Modal(document.getElementById('exampleModalToggle'));
                        modal.show();
                    }
                    else {
                        setStep((prev) => prev - 1);
                        if (step === 1) {
                            const inp = document.querySelectorAll("input");
                            const button = document.querySelector(".guess-btn");
                            inp.forEach(input => {
                                input.setAttribute("readOnly", "Нет");
                            });
                            button.setAttribute("type", "button");
                            setHeader("Sorry")
                            setResult('bg-danger')
                            const modal = new Bootstrap.Modal(document.getElementById('exampleModalToggle'));
                            modal.show();
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    setStart(false);
                })
        }
    }

    function hasTwoOrMoreSameDigits(inputString) {
        const digitCount = {};

        for (let char of inputString) {
            if (/\d/.test(char)) {
                if (digitCount[char]) {
                    digitCount[char]++;
                    if (digitCount[char] >= 2) {
                        return true;
                    }
                } else {
                    digitCount[char] = 1;
                }
            }
        }

        return false;
    }

    const handleToggleLeader = (value) => {
        setLeader(value);
    };

    const logOut = () => {
        sessionStorage.clear();
        window.location.reload();
    }

    function handleInputFocus(e){
        console.log(e.target);
        if(e.target.readOnly) {
            toast("Please start the game before entering a guess.");
        }
    }

    function handleButton(){
        const button = document.querySelector('.guess-btn');
        if(button.getAttribute('type') === 'button'){
            toast("Please start the game before entering a guess.");
        }
    }

    return (
        <>
            {
                leader === true ?
                    <>
                        <Leaderboard
                            functions={{
                                toggleLeader: handleToggleLeader,
                                otherFunction: logOut,
                            }}
                        />
                    </>
                    :
                    <div>
                        <h4 onClick={() => handleToggleLeader(true)} className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor: "pointer"}}>Leaderboard</h4>
                        <h4 onClick={() => logOut()} className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor: "pointer"}}>Log out</h4>

                        <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className={`modal-header border-0 ${result}`}>
                                        <h2 className="modal-title text-white">{header}</h2>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className={`modal-body rounded-bottom text-white ${result}`}>
                                        <p>{array[array.length-1]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Toaster />
                        </div>
                        <div className="container d-flex align-items-center justify-content-center flex-column">
                            <h1 className="fw-bold ">Guessing Game!</h1>
                            <button onClick={() => StartGame()} className="game-btn fw-bold">Start a new game</button>
                            <p className="guess fw-bold text-white">Guess a number:</p>
                            <form onSubmit={submit}>
                                <div className="d-flex gap-2">
                                    {Object.keys(inputValues).map((inputName) => (
                                        <input
                                            required
                                            readOnly="Нет"
                                            key={inputName}
                                            ref={inputRefs[inputName]}
                                            value={inputValues[inputName]}
                                            onChange={(e) => handleInputChange(e, inputName)}
                                            onKeyDown={(e) => handleKeyDown(e, inputName)}
                                            maxLength="1"
                                            onFocus={(e) => handleInputFocus(e)}
                                        />
                                    ))}
                                </div>
                                <button
                                    className="guess-btn text-white"
                                    type="button"
                                    onClick={handleButton}
                                >
                                    Guess
                                </button>
                            </form>
                            <div className="attempts">
                                <div className="green" style={{ width: `${width}%` }}></div>
                            </div>
                            <p className="guess-p fw-bold text-white">Your recorded Guesses:</p>
                            {
                                (start) ?
                                    <div>

                                    </div>
                                    :
                                    <p className="guess-p fw-bold text-white">Not Started!</p>
                            }
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                {array.map((item, index) => (
                                    <p
                                        key={index}
                                        className={`${
                                            step === 8 && index === array.length - 1
                                                ? "text-success fw-bold" // Apply this style if step is 8 and it's the last item
                                                : step === 0 && index === array.length - 1
                                                    ? "text-danger fw-bold" // Apply this style if step is 0 and it's the last item
                                                    : "text-white fw-bold" // Apply text-white if no special style is needed
                                        }`}
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default Game;