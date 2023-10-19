import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Leaderboard.css';
import  "bootstrap/dist/js/bootstrap.min"
function LeaderBoard(props) {
    const [data, setData] = useState([]);
    const [showingHistoryFor, setShowingHistoryFor] = useState(false);
    const [item, setItem] = useState(null);
    const [history, setHistory] = useState(null);
    const { toggleLeader, otherFunction } = props.functions;

    useEffect(  () =>  {
        // run();
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7182/api/LeaderBoard');
                const userData = response.data.map((leaderboardEntry) => {
                    const wins = leaderboardEntry.games.reduce((count, game) => count + (game.win ? 1 : 0), 0);

                    const minAttempts = leaderboardEntry.games.length > 0
                        ? leaderboardEntry.games.reduce(
                            (min, game) => (game.attempts < min ? game.attempts : min),
                            Number.MAX_SAFE_INTEGER
                        )
                        : 0;

                    return {
                        id: leaderboardEntry.id,
                        name: leaderboardEntry.name,
                        email: leaderboardEntry.email,
                        password: leaderboardEntry.password,
                        games: leaderboardEntry.games,
                        wins: wins,
                        minAttempts: minAttempts,
                    };
                });


                setData(userData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const toggleHistoryVisibility = (value, item) => {
        setShowingHistoryFor(value);
        setItem(item);
    };

    const toggleDescription = (index) => {
        setHistory((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div>
            <h4 className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor:"pointer"}} onClick={() => toggleLeader(false)}>Game</h4>
            {showingHistoryFor === true ? <h4 className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor: "pointer"}} onClick={() => toggleHistoryVisibility(false)}>Leaderboard</h4> : <></>}
            <h4 className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor: "pointer"}} onClick={otherFunction}>Log out</h4>
            {
                (showingHistoryFor === false) ?
                    <div>
                        <h1 className='text-center'>Leaderboard</h1>
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>
                                    <table className='table'>
                                        <thead className='thead'>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Played Games</th>
                                            <th>Wins</th>
                                            <th>Best Attempt</th>
                                            <th>History</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className='tr'>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.games.length}</td>
                                            <td>{item.wins}</td>
                                            <td>{item.minAttempts}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHistoryVisibility(true, item)}
                                                    className="bg-warning border-0 p-2 "
                                                >
                                                    Show History
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </li>
                            ))}
                        </ul>
                    </div>
                    :
                    <div>
                        <h1 className='text-center'>History</h1>
                        {
                            item.games[0] === undefined ? <p className="text-center text-warning fs-1">Oops!! No Games</p>
                            :
                            <ul>
                                {item?.games?.map((g, index) => (
                                    console.log(g),
                                    <li key={index}>
                                        <table className='table'>
                                            <thead className='thead'>
                                            <tr>
                                                <th>Attempts</th>
                                                <th>Win</th>
                                                <th>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr className='tr'>
                                                <td>{g.attempts}</td>
                                                <td>{g.win.toString()}</td>
                                                <td>
                                                    <button
                                                    type="button"
                                                    style={{width:'33%'}}
                                                    className="bg-warning border-0 p-2"
                                                    onClick={() => toggleDescription(index)}
                                                    >
                                                    {history === index ? 'Hide Description' : 'Show Description'}
                                                    </button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        {history === index && (
                                            <div>
                                                <ul>
                                                    {g.description.map((desc, index) => (
                                                        <li key={index}>{desc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
            }
        </div>
    );
}

export default LeaderBoard