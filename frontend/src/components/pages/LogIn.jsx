import React, {useEffect, useState} from 'react';
import './LogIn.css';

import Cashier from '../../Cashier.jsx'
import Display from '../../Display.jsx'


function LogIn({setNavbarVisibility}){
    let currentEmployee = {};

    // State to hold username and password input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/employee/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const employeeList = await response.json();

                    setEmployees(employeeList)
                } else {
                    console.error("Failed to fetch employees:", response.status);
                }
            } catch (error) {
                console.error("Error fetching employess:", error);
            }
        };

        fetchItems();
    }, []);

    const [currentScreen, setCurrentScreen] = useState('login');

    function logout(){
        setCurrentScreen('login');
        setNavbarVisibility(true);
    }

    // Handler for form submission (for simplicity, just logging the values)
    const handleLogin = () => {
        for(let i = 0; i < employees.length; i++){
            if( (employees[i].username.toLowerCase() === username.toLowerCase()) && (employees[i].pass === password) ){
                setNavbarVisibility(false);
                if(employees[i].position === "employee"){
                    setCurrentScreen('employee');
                    currentEmployee = employees[i];
                }else if(employees[i].position === "manager"){
                    setCurrentScreen('manager');
                    currentEmployee = employees[i];
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

    const handleKeyPress = (event) => {
        // Check if the pressed key is "Enter"
        if (event.key === "Enter") {
            // Call the function you want to run here
            handleLogin();
        }
    };

    useEffect(() => {
        // Add event listener for keydown event
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup event listener when the component is unmounted
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

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
                <Cashier logout={logout} employee={currentEmployee} />
            )}

            {currentScreen === 'manager' && (
                <Display logout={logout} />
            )}
        </div>
    );
}

export default LogIn;