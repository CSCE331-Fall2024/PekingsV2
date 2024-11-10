import React, { useState } from 'react';
import './LogIn.css';

import Cashier from '../../Cashier.jsx'
import Display from '../../Display.jsx'

const employees = [
    {
        "id": 1,
        "username": "ThomasC",
        "pass": "CC137",
        "email": null,
        "position": "employee",
        "lastClockin": "00:00:00",
        "isClockedin": false,
        "pin": null
    },
    {
        "id": 5,
        "username": "NathanM",
        "pass": "yourboi",
        "email": null,
        "position": "employee",
        "lastClockin": "00:00:00",
        "isClockedin": false,
        "pin": null
    },
    {
        "id": 2,
        "username": "Fabio",
        "pass": "thebatcave",
        "email": null,
        "position": "employee",
        "lastClockin": "17:57:46.214",
        "isClockedin": true,
        "pin": null
    },
    {
        "id": 4,
        "username": "NathanL",
        "pass": "meltmyeyes",
        "email": null,
        "position": "employee",
        "lastClockin": "00:00:00",
        "isClockedin": true,
        "pin": null
    },
    {
        "id": 6,
        "username": "Yasuo",
        "pass": "hasagi",
        "email": null,
        "position": "manager",
        "lastClockin": "00:00:00",
        "isClockedin": false,
        "pin": null
    },
    {
        "id": 3,
        "username": "Germ",
        "pass": "Machamp",
        "email": null,
        "position": "employee",
        "lastClockin": "17:28:26.18",
        "isClockedin": false,
        "pin": null
    }
]

function LogIn(){
    // State to hold username and password input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [currentScreen, setCurrentScreen] = useState('login');

    function logout(){
        setCurrentScreen('login');
    }

    // Handler for form submission (for simplicity, just logging the values)
    const handleLogin = () => {
        for(let i = 0; i < employees.length; i++){
            if( (employees[i].username.toLowerCase() === username.toLowerCase()) && (employees[i].pass === password) ){
                console.log(employees[i].position);
                if(employees[i].position === "employee"){
                    setCurrentScreen('employee');
                }else if(employees[i].position === "manager"){
                    setCurrentScreen('manager');
                }else{
                    console.log(employees[i].position);
                }
                break;
            }

            if(i === employees.length - 1){
                alert('Login credentials not recognized, please try again.');
            }
        }

        // In a real scenario, you'd likely send this data to a server for authentication
        setUsername("");
        setPassword("");
    };

    return (
        <div>
            {currentScreen === 'login' && (
                <div className="login-screen">
                    <div className="title-container-login">
                        <div className="title">Employee<br/>Login</div>
                    </div>

                    <div className="login-information-container">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" onClick={() => handleLogin()}>Login</button>
                    </div>
                </div>
            )}

            {currentScreen === 'employee' && (
                <Cashier logout={logout} />
            )}

            {currentScreen === 'manager' && (
                <Display logout={logout} />
            )}
        </div>
    );
}

export default LogIn;