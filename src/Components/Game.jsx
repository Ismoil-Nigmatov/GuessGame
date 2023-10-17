import React, {createRef, useState} from 'react';
import {toast, Toaster} from "alert";
import axios from "axios";
import './Game.css'
import Leaderboard from "./Leaderboard";


const Game = () => {
    const [step , setStep] = useState(8);
    const [width, setWidth] = useState(100);
    const [array , setArray]  = useState([])
    const [start , setStart] = useState(false);
    const [leader , setLeader] = useState(false);
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
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            setInputValues({ ...inputValues, [inputName]: value });
            if (value !== "") {
                const nextInputName = `input${parseInt(inputName.slice(-1)) + 1}`;
                if (inputRefs[nextInputName]) {
                    inputRefs[nextInputName].current.focus();
                }
            }
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

        await axios.get('https://localhost:7182/api/Game',{
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
        button.removeAttribute("disabled");
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
            const apiUrl = `https://localhost:7182/api/Game/guess/${sessionId}?userInput=${userInput}`
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
                        button.setAttribute("disabled", "true");
                    }
                    else {
                        setStep((prev) => prev - 1);
                        if (step === 1) {
                            const inp = document.querySelectorAll("input");
                            const button = document.querySelector(".guess-btn");
                            inp.forEach(input => {
                                input.setAttribute("readOnly", "Нет");
                            });
                            button.setAttribute("disabled", "true");
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

    return (
        <>
            {
                leader === true ?
                    <>
                        <Leaderboard toggleLeader={handleToggleLeader}/>
                    </>
                    :
                    <div>
                        <h4 onClick={() => handleToggleLeader(true)} className="text-end text-white mt-5 me-5" style={{cursor: "pointer"}}>Leaderboard</h4>
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
                                            readOnly="Нет"
                                            key={inputName}
                                            ref={inputRefs[inputName]}
                                            value={inputValues[inputName]}
                                            onChange={(e) => handleInputChange(e, inputName)}
                                            onKeyDown={(e) => handleKeyDown(e, inputName)}
                                            maxLength="1"
                                        />
                                    ))}
                                </div>
                                <button className="guess-btn text-white" type="submit" disabled={true}>Guess</button>
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