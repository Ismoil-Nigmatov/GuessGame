import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Leaderboard.css';
import  "bootstrap/dist/js/bootstrap.min"
function LeaderBoard(props) {
    const [data, setData] = useState([]);
    const [showingHistoryFor, setShowingHistoryFor] = useState(null);
    const [itemId, setItemId] = useState(null);
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
                        minAttempts: minAttempts, // Minimum attempts
                    };
                });


                setData(userData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const toggleHistoryVisibility = (index, item) => {
        setShowingHistoryFor(index === showingHistoryFor ? null : index);
        setItemId(item);
    };

    return (
        <div>
            <h4 className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor:"pointer"}} onClick={() => toggleLeader(false)}>Game</h4>
            <h4 className="d-inline-block text-start text-white mt-5 m-lg-5" style={{cursor: "pointer"}} onClick={otherFunction}>Log out</h4>
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
                                <th>User Attempt</th>
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
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        onClick={() => toggleHistoryVisibility(index, item.id)}
                                        className="bg-warning border-0 p-2 "
                                    >
                                        {showingHistoryFor === index ? 'Hide History' : 'Show History'}
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        {showingHistoryFor === index && (
                            <div aria-labelledby="dropdownMenuButton">
                                {data?.map((i) => {
                                    return(
                                        <>
                                            {
                                                (i.id === itemId) ?
                                                    <div>
                                                        {
                                                            ((i.games[0] === undefined) ? <p>Oops!! No Games</p> :
                                                                i.games[i.games.length - 1].description?.map((d, index) =>{
                                                                return (
                                                                    <p key={index}>{d}</p>
                                                                )
                                                            }))

                                                        }
                                                    </div>
                                                    :
                                                    <div>
                                                    </div>
                                            }
                                        </>
                                    )
                                })}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeaderBoard