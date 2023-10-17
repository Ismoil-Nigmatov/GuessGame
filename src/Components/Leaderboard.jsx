import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Leaderboard.css';

function LeaderBoard({ toggleLeader }) {
    const [data, setData] = useState([]);

    const run = async()=>{
        try {
            const response = await axios.get('https://localhost:7182/api/LeaderBoard');
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(  () =>  {
        run();
    }, []);

    return (
        <div>
            <h4 className="text-white text-end mt-5 me-5" style={{cursor:"pointer"}} onClick={() => toggleLeader(false)}>Game</h4>
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
                                <th>User Attempt</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className='tr'>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.games.length}</td>
                                <td>{item.games[item.games.length - 1].attempts}</td>
                            </tr>
                            </tbody>
                        </table>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeaderBoard