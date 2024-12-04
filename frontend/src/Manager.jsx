import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manager.css';
import {useAuth0} from "@auth0/auth0-react";


/**
 * The `Manager` component provides a comprehensive dashboard for managing restaurant operations.
 * It includes functionality for managing inventory, menu items, employees, and viewing statistics.
 * This component integrates authorization using Auth0 and external APIs for added functionalities like weather updates.
 *
 * @component
 * @param {Object} props - The props passed to the `Manager` component.
 * @param {string} props.selectedSection - The currently selected section of the dashboard to display.
 * @returns {JSX.Element} A dynamic management interface for controlling inventory, menu items, employees, and statistics.
 *
 * @state
 * @state {Object} data - Weather data fetched from the OpenWeatherMap API.
 * @state {boolean} showTemp - Flag to toggle display of temperature and weather details.
 * @state {Array<Object>} inventory - A list of inventory items.
 * @state {number} editIdx - Index of the currently edited inventory item.
 * @state {Array<Object>} originalFormData - Backup of the original inventory data before edits.
 * @state {Array<Object>} menuItems - A list of menu items.
 * @state {Array<Object>} employees - A list of employees with their details.
 * @state {Array<Object>} reportList - A list of statistics reports, such as hourly revenue.
 * @state {Array<Object>} incompleteOrdersList - A list of incomplete orders with details.
 * @state {string} selectedButton - The selected statistics or report view.
 * @state {string} formattedTime - Current time in "HH:MM AM/PM" format.
 * @state {string} currentDateTime - Current date and time in "MM/DD/YYYY" format.
 * @state {Object} inputFields - Object containing values for various input fields across sections.
 *
 * @methods
 * @method fetchItems - Fetches all menu items from the API.
 * @method fetchItems2 - Fetches all inventory items from the API.
 * @method fetchItems3 - Fetches all employees from the API.
 * @method fetchItems4 - Fetches daily order reports for generating statistics.
 * @method fetchItems5 - Fetches all incomplete orders from the API.
 * @method handleEditClick - Enables editing mode for an inventory item.
 * @method handleSave - Saves the edits made to the inventory item.
 * @method handleCancel - Cancels the inventory edit operation and restores the original data.
 * @method handleButton - Adds a new item to the inventory.
 * @method handleButtonMenu - Adds a new menu item.
 * @method handleStatsXReport - Displays the X Report for the current day.
 * @method handleStatsOrders - Displays current orders in the statistics section.
 * @method addToInventory - Adds a new inventory item through the API.
 * @method updateInventory - Updates an existing inventory item through the API.
 * @method deleteInventory - Deletes an inventory item using its ID.
 * @method addToMenu - Adds a new menu item through the API.
 * @method updateMenuItem - Updates an existing menu item through the API.
 * @method deleteMenuItem - Deletes a menu item using its ID.
 * @method addEmployee - Adds a new employee through the API.
 * @method updateEmployee - Updates an existing employee through the API.
 * @method deleteEmployee - Deletes an employee using their ID.
 *
 * @effects
 * @effect Dynamically renders the management interface based on the selected section.
 * - Updates inventory, menu items, employees, and statistics dynamically based on user interactions.
 * - Fetches and displays weather data upon request.
 * - Provides accessibility to all operational data with real-time updates.
 *
 * @example
 * // Rendered in a parent component
 * <Manager selectedSection="Inventory" />
 *
 * @remarks
 * - Integrates Auth0 for secure access and management of sensitive operations.
 * - Includes a weather API integration for real-time data updates.
 * - Covers all critical management operations like adding, editing, and deleting resources.
 */


function Manager({ selectedSection }) {

    //WeatherAPI
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=galveston&appid=96263f8d04e9d9b5ce1c27930643efa7'
    const[data,setData] = useState({});
    const [showTemp, setShowTemp] = useState(false);

    //Authorization
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    //Inventory
    const [inventory, setInventory] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [originalFormData, setOriginalFormData] = useState([]);
    const [editInvValueID, setEditInvValueID] = useState(-1);
    const [inputValueName, setInputValueName] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [inputValueID, setInputValueID] = useState('');

    //Menu
    const [menuItems, setMenuItems] = useState([]);
    const [originalMenuItems, setOriginalMenuItems] = useState([]);
    const [editMenuValueID, setEditMenuValueID] = useState(-1);
    const [inputMenuName, setInputMenuName] = useState('');
    const [inputMenuCategory, setInputMenuCategory] = useState("");
    const [inputMenuIngredients, setInputMenuIngredients] = useState('');
    const [inputMenuPrice, setInputMenuPrice] = useState('');
    const [inputMenuID, setInputMenuID] = useState('');


    //Employee
    const [employees, setEmployees]= useState([]);
    const [editEmployeeValueID, setEditEmployeeValueID] = useState(-1);
    const [inputEmployeeUsername, setInputEmployeeUsername] = useState('');
    const [inputEmployeePass, setInputEmployeePass] = useState('');
    const [inputEmployeeEmail, setInputEmployeeEmail] = useState('');
    const [inputEmployeePosition, setInputEmployeePosition] = useState('');
    const [inputEmployeeLastClockin, setInputEmployeeLastClockin] = useState('00:00:00');
    const [inputEmployeeIsClockedIn, setInputEmployeeIsClockedIn] = useState(false);
    const [inputEmployeePin, setInputEmployeePin] = useState('0000');
    const [originalEmployees, setOriginalEmployees] = useState([]);
    const [inputEmployeeID, setInputEmployeeID] = useState();

    // Statistics
    const [reportList, setReportList] = useState([]);
    const [incompleteOrdersList, setIncompleteOrdersList] = useState([]);
    const [selectedButton, setSelectedButton] = useState("");
    const currentDateTime = new Date().toLocaleString('en-us', {month: '2-digit', day: '2-digit', year: '2-digit'}); // Formats to "MM/DD/YYYY, HH:MM:SS AM/PM"
    const currentClock = new Date();
    const formattedTime = currentClock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formatHour =  new Date().getHours();

    //For Weather
    const getLocation = () => {
            axios.get(url).then((response) => {
                setData(response.data)
                console.log(response.data)
            })
    };
    const handleClick = () => {
        getLocation();
        setShowTemp(!showTemp);

    };


    const fetchItems = async () => {
            try {
                const response = await fetch("/api/menuitem/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const items = await response.json();

                    console.log(items);
                    setMenuItems(items);
                } else {
                    console.error("Failed to fetch items:", response.status);
                }

            } catch (error) {
                console.error("Error fetching items:", error);
            }
        const token = await getAccessTokenSilently();
        console.log("Token:", token);
    };
    useEffect(() => {
        fetchItems();
    }, []);

        const fetchItems2 = async () => {
            try {
                const invResponse = await fetch("/api/inventory/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
                if (invResponse.ok) {
                const items = await invResponse.json();
                    setInventory(items);
                } else {
                    console.error("Failed to fetch items:", invResponse.status);
                }

            }   catch (error) {
                console.error("Error fetching items:", error);
            }
        };
    useEffect(() => {
        fetchItems2();
    },[]);


        const fetchItems3 = async () => {
            try {
                const empResponse = await fetch('/api/employee/all', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${await getAccessTokenSilently()}`,
                        "Content-Type": "application/json",
                    },
                });
                if (empResponse.ok) {
                    const items = await empResponse.json();
                    console.log(items);
                    setEmployees(items);
                } else {
                    console.error("Failed to fetch items:", empResponse.status);
                    alert("Failed to load employees empResponse not okay")
                }

            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

    useEffect(() => {
        if (!user) return;
        fetchItems3();
    },[isAuthenticated, getAccessTokenSilently, user]);


    //Get list of orders that have not been completed yet to keep track in case manager
    //needs to step out of their office and help the kitchen line.
    const fetchItems4 = async () => {
        try {
            const reportResponse = await fetch("/api/orders/past/day", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
            });
            if (reportResponse.ok) {
                const items = await reportResponse.json();
                setReportList(items);
            } else {
                console.error("Failed to fetch items:", reportResponse.status);
                alert("Failed to load past/day orders reportResponse not okay")
            }

        }   catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    useEffect(() => {
        if (!user) return;
        fetchItems4();
    },[isAuthenticated, getAccessTokenSilently, user]);

    const fetchItems5 = async () => {
        try {
            const reportResponse = await fetch("/api/orders/status/incomplete", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
            });
            if (reportResponse.ok) {
                const items = await reportResponse.json();
                setIncompleteOrdersList(items);
            } else {
                console.error("Failed to fetch items:", reportResponse.status);
                alert("Failed to load incomplete orders reportResponse not okay")
            }

        }   catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    useEffect(() => {
        if (!user) return;
        fetchItems5();
    },[isAuthenticated, getAccessTokenSilently, user]);


    /*@PostMapping("/add")
    public Inventory addIngredient(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }*/


    // Edit for Inventory
    const handleEditClick = (index) => {
        setEditIdx(index);
        setOriginalFormData(inventory);
        setEditInvValueID(inventory.at(index).id);
    };

    const handleInputChange = (e, field, index) => {
        const updatedInventory = inventory.map((item, idx) => {
            if (idx === index) {
                return {...item, [field]: e.target.value};
            }
            return item;
        });
        setInventory(updatedInventory);
    };
    const handleSave = () => {
        setEditIdx(-1);
        updateInventory();
    };
    const handleCancel = () => {
        setEditIdx(-1);
        setInventory(originalFormData);
    };

    // Edit for Menu
    const handleEditClickMenu = (index) => {
        setEditIdx(index);
        setOriginalMenuItems(menuItems);
        setInputMenuName(menuItems.at(index).name);
        setInputMenuPrice(menuItems.at(index).price);
        setEditMenuValueID(menuItems.at(index).id);
        setInputMenuCategory(menuItems.at(index).category);
        setInputMenuIngredients(menuItems.at(index).ingredients.at(0).ingredient);

    };
    // Function to handle input change for Menu Items
    const handleInputChangeMenu = (e, field, index) => {
        const updatedMenuItems = menuItems.map((item, idx) => {
            if (idx === index)
            {
                return {...item, [field]: e.target.value}; }
            return item; });
        setMenuItems(updatedMenuItems);
    };

    // Function to handle saving the edited row for Menu Items
    const handleSaveMenu = () => {
        setEditIdx(-1);
        updateMenuItem();
        setEditMenuValueID(-1);
        setInputMenuName("");
        setInputMenuPrice("");
        setInputMenuCategory("");
        setInputMenuIngredients("");
    };
    // Function to handle canceling the edit for Menu Items
    const handleCancelMenu = () => {
        setEditIdx(-1);
        setMenuItems(originalMenuItems);
    };

    const handleEditClickEmployee = (index) => {
        setEditIdx(index);
        setOriginalEmployees(employees); // Backup original state
        const employee = employees.at(index);
        setEditEmployeeValueID(employee.id);
        setInputEmployeeUsername(employee.username);
        setInputEmployeePass(employee.pass);
        setInputEmployeeEmail(employee.email || '');
        setInputEmployeePosition(employee.position);
        setInputEmployeeLastClockin(employee.lastClockin);
        setInputEmployeeIsClockedIn(employee.isClockedin);
        setInputEmployeePin(employee.pin);
    };


    const handleSaveEmployee = () => {
        setEditIdx(-1);
        updateEmployee();
        resetEmployeeInputs();
    };

    const handleCancelEmployee = () => {
        setEditIdx(-1);
        setEmployees(originalEmployees); // Restore original state
        resetEmployeeInputs();
    };


    const resetEmployeeInputs = () => {
        setEditEmployeeValueID(-1);
        setInputEmployeeUsername('');
        setInputEmployeePass('');
        setInputEmployeeEmail('');
        setInputEmployeePosition('');
        setInputEmployeeLastClockin('00:00:00');
        setInputEmployeeIsClockedIn(false);
        setInputEmployeePin('0000');
    };



    const addToInventory = async () => {
        //Replace this inv object with arbitrary object values
        // Make a function that will return an object with user defined values except ID.
        // set inv equal to what the function returns
        let amountt = parseInt(inputValueAmount);
        let pricee = parseInt(inputValuePrice);
        let batch = amountt * pricee;

        const inv = {
            name: inputValueName,
            servingPrice: inputValuePrice,
            amount: inputValueAmount,
            priceBatch: batch,
        };

        try {
            const invResponse = await fetch("/api/inventory/add", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inv)
            });

            if (!invResponse.ok) {
                const error = await invResponse.json();
                console.error("Error adding inventory item:", error);
                alert("Failed to add inventory item. See console for details.");
            } else {
                const data = await invResponse.json();
                console.log("Inventory item added successfully:", data);
                alert("Inventory item added successfully!");
                fetchItems2();
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while adding inventory item.");
        }

    };
    const addToMenu = async () => {
        const menu = {
            name: inputMenuName,           // Menu item name from input
            price: inputMenuPrice,         // Menu item price from input
            active: false,                 // Default active state
            category: inputMenuCategory,   // Corrected "category" to "category"
            image: null,                   // Optional field for image
            ingredients: [
                {
                    ingredient: {id: inputMenuIngredients},
                    amount: 1
                }
            ]
        }
        try {
            const menuResponse = await fetch("/api/menuitem/add", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(menu)
            });

            if (!menuResponse.ok) {
                const error = await menuResponse.json();
                console.error("Error adding menu item:", error);
                alert("Failed to add menu item. See console for details.");
            } else {
                const data = await menuResponse.json();
                console.log("Menu item added successfully:", data);
                alert("Menu item added successfully!");

                fetchItems();
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while adding menu item.");
        }
    };
    // Add Employee
    const addEmployee = async () => {
        const employee = {
            username: inputEmployeeUsername,
            pass: inputEmployeePass,
            email: inputEmployeeEmail || null, // Email is nullable
            position: inputEmployeePosition.toUpperCase(),
            lastClockin: inputEmployeeLastClockin, // Default to "00:00:00"
            isClockedin: inputEmployeeIsClockedIn,
            pin: inputEmployeePin,
        };

        try {
            const employeeResponse = await fetch("/api/employee/add", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employee),
            });

            if (!employeeResponse.ok) {
                const error = await employeeResponse.json();
                console.error("Error adding employee:", error);
                alert("Failed to add employee. See console for details.");
            } else {
                const data = await employeeResponse.json();
                console.log("Employee added successfully:", data);
                alert("Employee added successfully!");
                fetchItems3(); // Refresh employee list
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while adding employee.");
        }
    };


    const updateInventory = async () => {
        let amountt = parseInt(inputValueAmount);
        let pricee = parseInt(inputValuePrice);
        let batch = amountt * pricee;
        const editedInventory = {
            id: editInvValueID,
            name: inputValueName,
            amount: inputValueAmount,
            servingPrice: inputValuePrice,
            priceBatch: batch
        }
        const invResponse = await fetch("/api/inventory/update", {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${await getAccessTokenSilently()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedInventory)
        });

    };
    const deleteInventory = async (id) => {
        try{
        const invResponse = await fetch("/api/inventory/delete", {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${await getAccessTokenSilently()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id)
        });
        if (invResponse.ok) {
            alert(`Successfully deleted inventory item`)
        } else {
            console.error("Failed to delete inventory item:", invResponse.status);
            alert("Failed to delete inventory item")
        }

    }   catch (error) {
        console.error("Error fetching items:", error);
    }
        fetchItems2();
    };
    const updateMenuItem = async () => {
        const editedMenu = {
            id: editMenuValueID,
            name: inputMenuName,           // Menu item name from input
            price: inputMenuPrice,         // Menu item price from input
            active: false,                 // Default active state
            category: inputMenuCategory,   // Corrected "category" to "category"
            image: null,                   // Optional field for image
            ingredients: [
                {
                    ingredient: {id: inputMenuIngredients},
                    amount: 1
                }
            ]
        }
        try {
            const menuResponse = await fetch("/api/menuitem/update", {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedMenu)
            });

            if (!menuResponse.ok) {
                const error = await menuResponse.json();
                console.error("Error updating menu item:", error);
                alert("Failed to update menu item. See console for details.");
            } else {
                const data = await menuResponse.json();
                console.log("Menu item updated successfully:", data);
                alert("Menu item updated successfully!");
                fetchItems();
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while updating menu item.");
        }
    };

    const deleteMenuItem = async (id) => {
        try{
            // let menuID = parseInt(inputMenuID);
        const menuResponse = await fetch("/api/menuitem/delete", {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${await getAccessTokenSilently()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id)

        });
        if (menuResponse.ok) {
            alert(`Successfully deleted menu item`)
        } else {
            console.error("Failed to delete inventory item:", menuResponse.status);
            alert("Failed to delete inventory item")
        }

        }   catch (error) {
        console.error("Error fetching items:", error);
    }

        fetchItems();
    };

// Update Employee
    const updateEmployee = async () => {
        const editedEmployee = {
            id: editEmployeeValueID,
            username: inputEmployeeUsername,
            pass: inputEmployeePass,
            email: inputEmployeeEmail || null,
            position: inputEmployeePosition,
            lastClockin: inputEmployeeLastClockin,
            isClockedin: inputEmployeeIsClockedIn,
            pin: inputEmployeePin,
        };

        try {
            const employeeResponse = await fetch("/api/employee/update", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedEmployee),
            });

            if (!employeeResponse.ok) {
                const error = await employeeResponse.json();
                console.error("Error updating employee:", error);
                alert("Failed to update employee. See console for details.");
            } else {
                const data = await employeeResponse.json();
                console.log("Employee updated successfully:", data);
                alert("Employee updated successfully!");
                fetchItems3(); // Refresh employee list
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while updating employee.");
        }
    };


// Delete Employee
    const deleteEmployee = async (id) => {
        try {
            const employeeResponse = await fetch("/api/employee/delete", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });

            if (!employeeResponse.ok) {
                console.error(`Failed to delete employee ${id} `);
                alert(`Employee ${id} failed to be deleted`);
            } else {
                alert(`Employee ${id} deleted successfully`);
                fetchItems3(); // Refresh employee list
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error while deleting employee.");
        }
    };


    // Text Boxes
    const handleChange = (event) => {
        setInputValueName(event.target.value);
    };
    const handleChange2 = (event) => {
        setInputValueAmount(event.target.value);
    };
    const handleChange3 = (event) => {
        setInputValuePrice(event.target.value);
    };
    const handleChange4 = (event) => {
      setInputValueID(event.target.value);
    };
    const handleChangeMenu = (event) => {
        setInputMenuName(event.target.value);
    };
    const handleChangeMenu2 = (event) => {
        setInputMenuPrice(event.target.value);
    };
    const handleChangeMenu3 = (event) => {
        setInputMenuCategory(event.target.value);
    };
    const handleChangeMenu4 = (event) => {
        setInputMenuIngredients(event.target.value);
    };
    const handleChangeMenu5 = (event) => {
        setInputMenuID(event.target.value);
    };
    const handleChangeEmp = (event) => {
      setInputEmployeeID(event.target.value);
    };

    //Add and Delete Buttons
    const handleButton = () => {
        addToInventory();
        setInputValueName("");
        setInputValueAmount("");
        setInputValuePrice("");
    };

    const handleButtonMenu = () => {
        addToMenu();
        setInputMenuName("");
        setInputMenuCategory("");
        setInputMenuPrice("");
        setInputMenuIngredients("");
    };
    const handleMenuDelButton = () => {
        deleteMenuItem();
        setInputValueID('');
    }

    // Stats Handlers
    const handleStatsXReport = () => {
        setSelectedButton("xReport")
    }
    const handleStatsOrders = () => {
        setSelectedButton("Current Orders")
    }

    return (
        <div className="managerRoot">
            <div className="main-content">
                <div className="Header-Clock">
                    <div className="header">
                        <h1>{selectedSection}</h1>
                        <p>This is the {selectedSection} section.</p>
                    </div>

                    <div className="clockBox">
                        <h3>Current Time:</h3>
                        <p className="Clock">{formattedTime}</p>
                    </div>

                </div>


                {/* Conditional Rendering for Table Layout */}
                {selectedSection === "Inventory" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ingredient</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Batch Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventory.map((item, index) => (
                            <tr key={index}>
                                {editIdx === index ? (
                                    <>
                                        <td>{item.id}</td>
                                        <td><input type="text" value={item.name}
                                                   onChange={(e) => handleInputChange(e, 'name', index)}/></td>
                                        <td><input type="text" value={item.amount}
                                                   onChange={(e) => handleInputChange(e, 'amount', index)}/></td>
                                        <td><input type="text" value={item.servingPrice}
                                                   onChange={(e) => handleInputChange(e, 'servingPrice', index)}/></td>
                                        <td>{item.priceBatch}</td>
                                        <td>
                                            <button onClick={handleSave}>Save</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.amount}</td>
                                        <td>${item.servingPrice}</td>
                                        <td>${item.priceBatch}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(index)}>Edit</button>
                                            <button onClick={() => deleteInventory(item.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {selectedSection === "Inventory" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter item Name" value={inputValueName}
                               onChange={handleChange}/>
                        <input type="text" placeholder="Enter Stock Amount" value={inputValueAmount}
                               onChange={handleChange2}/>
                        <input type="text" placeholder="Enter item servingPrice" value={inputValuePrice}
                               onChange={handleChange3}/>
                        <button onClick={handleButton}> Add Item
                        </button>
                    </div>
                )}

                {selectedSection === "Menu Items" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Menu Item</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menuItems.map((item, index) => (
                            <tr key={index}>
                                {editIdx === index ? (
                                    <>
                                        <td>{item.id}</td>
                                        <td><input type="text" value={item.name}
                                                   onChange={(e) => handleInputChangeMenu(e, 'name', index)}/></td>
                                        <td><input type="text" value={item.price}
                                                   onChange={(e) => handleInputChangeMenu(e, 'price', index)}/></td>
                                        <td>
                                            <button onClick={handleSaveMenu}>Save</button>
                                            <button onClick={handleCancelMenu}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <button onClick={() => handleEditClickMenu(index)}>Edit</button>
                                            <button onClick={() => deleteMenuItem(item.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {selectedSection === "Menu Items" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter item Name" value={inputMenuName}
                               onChange={handleChangeMenu}/>
                        <input type="text" placeholder="Enter Price" value={inputMenuPrice}
                               onChange={handleChangeMenu2}/>
                        <input type="text" placeholder="Enter Category" value={inputMenuCategory}
                               onChange={handleChangeMenu3}/>
                        <input type="text" placeholder="ID of Ingredient" value={inputMenuIngredients}
                               onChange={handleChangeMenu4}/>
                        <button onClick={handleButtonMenu}>Add Item</button>
                    </div>
                )}
                {/*{selectedSection === "Menu Items" && (*/}
                {/*    <div className="add-button">*/}
                {/*        <input type="text" placeholder="Enter item ID" value={inputMenuID} onChange={handleChangeMenu5}/>*/}
                {/*        <button onClick={handleMenuDelButton}> DELETE Item*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}

                {selectedSection === "Employees" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Position</th>
                            <th>pin</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index}>
                                {editIdx === index ? (
                                    <>
                                        <td>{employee.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputEmployeeUsername}
                                                onChange={(e) => setInputEmployeeUsername(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputEmployeePass}
                                                onChange={(e) => setInputEmployeePass(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputEmployeePosition}
                                                onChange={(e) => setInputEmployeePosition(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputEmployeePin}
                                                onChange={(e) => setInputEmployeePin(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputEmployeeEmail}
                                                onChange={(e) => setInputEmployeeEmail(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={handleSaveEmployee}>Save</button>
                                            <button onClick={handleCancelEmployee}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{employee.id}</td>
                                        <td>{employee.username}</td>
                                        <td>{employee.pass}</td>
                                        <td>{employee.position}</td>
                                        <td>{employee.pin}</td>
                                        <td>{employee.email}</td>
                                        <td>
                                            <button onClick={() => handleEditClickEmployee(index)}>Edit</button>
                                            <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {selectedSection === "Employees" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter Username" value={inputEmployeeUsername}
                               onChange={(e) => setInputEmployeeUsername(e.target.value)}/>
                        <input
                            type="text"
                            placeholder="Enter Password"
                            value={inputEmployeePass}
                            onChange={(e) => setInputEmployeePass(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter Position"
                            value={inputEmployeePosition}
                            onChange={(e) => setInputEmployeePosition(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter pin (0000)"
                            value={inputEmployeePin}
                            onChange={(e) => setInputEmployeePin(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter Email"
                            value={inputEmployeeEmail}
                            onChange={(e) => setInputEmployeeEmail(e.target.value)}
                        />
                        <button onClick={addEmployee}>Add Employee</button>
                    </div>
                )}

                {selectedSection === "Statistics" && (
                    <div className="container">
                        <div className="stats-btn">
                            <div className="Weather-Btn-Box">
                                <div className="stats-btns">
                                    <button onClick={handleStatsXReport}> xReport</button>
                                    <button onClick={handleStatsOrders}> Current Orders</button>
                                </div>
                                <div className="weatherData">
                                    <button onClick={handleClick}>Weather</button>
                                    {showTemp && <h2>Temp: {data.main ? <h3>{Math.floor((data.main.temp - 273.15) * 1.8 + 32) + "°F"}</h3> : null}</h2>}
                                    {showTemp && <h2>Weather: {data.weather ? <h3>{data.weather[0].description}</h3> : null}</h2>}
                                </div>
                            </div>

                            {selectedButton === "xReport" && (
                                <div>
                                    <></>
                                    <h3 className="statsH3">xReport: {currentDateTime}</h3>
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Orders</th>
                                            <th>Revenue</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {reportList.map((item, index) => (
                                            item["hour"] < formatHour && (
                                                <tr key={index}>
                                                    <>
                                                        <td>{item["hour"] + ":00 - " + item["hour"] + ":59"}</td>
                                                        <td>{item["orders"]}</td>
                                                        <td>{"$" + item["revenue"]}</td>
                                                    </>
                                                </tr>
                                            )
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {selectedButton === "Current Orders" && (
                                <div>
                                    <h3 className="statsH3">Current Orders: {currentDateTime}</h3>
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Employee ID</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                            <th>Menu Item Name</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {incompleteOrdersList.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order["order_id"]}</td>
                                                <td>{order["employee_id"]}</td>
                                                <td>{new Date(order["time"]).toLocaleString()}</td>
                                                {/* Format the time */}
                                                <td>{order["status"]}</td>
                                                <td>
                                                    {order["items"].map((item2, index2) => {
                                                        const menuItem = menuItems.find(
                                                            (menu) => menu.id === item2["menu_item_id"]
                                                        );
                                                        return (
                                                            <div key={index2}>
                                                                {menuItem ? menuItem.name : "Unknown Item"}
                                                            </div>
                                                        );
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Manager;
