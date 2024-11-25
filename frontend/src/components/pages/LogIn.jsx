import React, {useEffect, useState} from 'react';
import './LogIn.css';

import Cashier from '../../Cashier.jsx'
import Display from '../../Display.jsx'
import Kitchen from '../../Kitchen.jsx'


function LogIn({setNavbarVisibility, setIsTranslateVisible}){
    // let currentEmployee = {};

    // State to hold username and password input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [employees, setEmployees] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState({});

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
                    setEmployees(employeeList);
                } else {
                    console.error("Failed to fetch employees:", response.status);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        // Call the fetchItems initially
        fetchItems();

        // Set up an interval to call fetchItems every 5 seconds
        const intervalId = setInterval(fetchItems, 5000); // 5000ms = 5 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const [currentScreen, setCurrentScreen] = useState('login');

    function logout(){
        setCurrentScreen('login');
        setNavbarVisibility(true);
        setIsTranslateVisible(true);
    }

    // Handler for form submission (for simplicity, just logging the values)
    const handleLogin = () => {
        for(let i = 0; i < employees.length; i++){
            if( (employees[i].username.toLowerCase() === username.toLowerCase()) && (employees[i].pass === password) ){
                setNavbarVisibility(false);
                setIsTranslateVisible(false);
                if(employees[i].position === "employee"){
                    setCurrentScreen('employee');
                    setCurrentEmployee(employees[i]);
                }else if(employees[i].position === "manager"){
                    // setCurrentScreen('manager');
                    setCurrentScreen('employee');
                    setCurrentEmployee(employees[i]);
                }else if(employees[i].position === "kitchen"){
                    setCurrentScreen('kitchen');
                    setCurrentEmployee(employees[i]);
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
    }, [username, password, employees]);

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
                <Cashier logout={logout} employee={currentEmployee} setIsTranslateVisible={setIsTranslateVisible} switchToManager={() => setCurrentScreen('manager')}/>
            )}

            {currentScreen === 'manager' && (
                <Display logout={logout} setIsTranslateVisible={setIsTranslateVisible}/>
            )}

            {currentScreen === 'kitchen' && (
                <Kitchen logout={logout} setIsTranslateVisible={setIsTranslateVisible}/>
            )}
        </div>
    );
}

export default LogIn;