import React, {useEffect, useState} from 'react';
import './LogIn.css';

import Cashier from '../../Cashier.jsx'
import Display from '../../Display.jsx'
import Kitchen from '../../Kitchen.jsx'

/**
 * The `LogIn` component manages the login screen for employees, allowing them to authenticate
 * and navigate to different sections based on their role (cashier, manager, or kitchen).
 * It fetches the employee list from an API, verifies login credentials, and renders the
 * appropriate screen (employee, manager, or kitchen) after successful login.
 *
 * @component
 * @returns {JSX.Element} A login interface that authenticates employees and redirects them to
 * different sections based on their role.
 *
 * @state
 * @state {string} username - The username input value entered by the user.
 * @state {string} password - The password input value entered by the user.
 * @state {Array<Object>} employees - A list of employee objects fetched from the server.
 * @state {Object} currentEmployee - The employee object representing the logged-in user.
 * @state {string} currentScreen - The current screen to display, such as 'login', 'employee',
 *                                'manager', or 'kitchen'.
 *
 * @methods
 * @method logout - Logs out the current employee and resets the application state to the login screen. Meant to be sent
 * to components as their logout functions.
 * @method handleLogin - Handles the form submission, checks the employee credentials, and navigates
 *                       to the appropriate screen based on the employee's role.
 * @method handleKeyPress - Listens for the "Enter" key press and triggers the login process.
 *
 * @effects
 * @effect Fetches employee data from the backend API and stores it in the component state.
 * - The employee data is periodically refreshed every 5 seconds.
 * @effect Dynamically switches between the login screen, employee dashboard, manager dashboard,
 *         and kitchen screen based on the logged-in user's role.
 *
 * @example
 * // Rendered in main App component
 * <LogIn setNavbarVisibility={setNavbarVisibility} setIsTranslateVisible={setIsTranslateVisible} />
 *
 * @remarks
 * - Handles both login and role-based navigation for employees.
 * - Supports dynamic employee login with real-time data fetching.
 * - Implements basic client-side login functionality with username and password matching.
 */
function LogIn({setNavbarVisibility, setIsTranslateVisible}){
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
                    setCurrentScreen('manager');
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