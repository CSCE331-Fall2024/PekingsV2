import React, { useState, useEffect } from 'react';
import './Manager.css';

function Manager({ selectedSection }) {

    //Inventory
    const [inventory, setInventory] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [originalFormData, setOriginalFormData] = useState([]);
    const [editInvValueID, setEditInvValueID] = useState(-1);
    const [inputValueName, setInputValueName] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [invID, setInvID] = useState('');

    //Menu
    const [menuItems, setMenuItems] = useState([]);
    const [originalMenuItems, setOriginalMenuItems] = useState([]);
    const [editMenuValueID, setEditMenuValueID] = useState(-1);
    const [menuItemID, setMenuItemID] = useState('');
    const [inputMenuName, setInputMenuName] = useState('');
    const [inputMenuCategory, setInputMenuCategory] = useState("");
    const [inputMenuIngredients, setInputMenuIngredients] = useState('');
    const [inputMenuPrice, setInputMenuPrice] = useState('');

    //Employee
    const [employees, setEmployees]= useState([]);
    const [editEmployeeValueID, setEditEmployeeValueID] = useState(-1);
    const [inputEmployeeUsername, setInputEmployeeUsername] = useState('');
    const [inputEmployeePass, setInputEmployeePass] = useState('');
    const [inputEmployeeEmail, setInputEmployeeEmail] = useState('');
    const [inputEmployeePosition, setInputEmployeePosition] = useState('');
    const [inputEmployeeClockin, setInputEmployeeClockin] = useState('00:00:00');
    const [inputEmployeeClockedIn, setInputEmployeeClockedIn] = useState(false);
    const [inputEmployeePin, setInputEmployeePin] = useState('0000');
    const [originalEmployees, setOriginalEmployees] = useState([]);

    // Statistics
    const [reportList, setReportList] = useState([]);
    const [incompleteOrdersList, setIncompleteOrdersList] = useState([]);
    const [selectedButton, setSelectedButton] = useState("");
    const currentDateTime = new Date().toLocaleString(); // Formats to "MM/DD/YYYY, HH:MM:SS AM/PM"




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
                const empResponse = await fetch("/api/employee/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (empResponse.ok) {
                    const items = await empResponse.json();
                    setEmployees(items);
                } else {
                    console.error("Failed to fetch items:", empResponse.status);
                }

            }   catch (error) {
                console.error("Error fetching items:", error);
            }
        };
    useEffect(() => {
        fetchItems3();
    },[]);


    // Get number of orders sold per hour, and total revenue for that hour
    const fetchItems4 = async () => {
        try {
            const reportResponse = await fetch("/api/orders/past/day", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (reportResponse.ok) {
                const items = await reportResponse.json();
                setReportList(items);
            } else {
                console.error("Failed to fetch items:", reportResponse.status);
            }

        }   catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    useEffect(() => {
        fetchItems4();
    },[]);

    //Get list of orders that have not been completed yet to keep track in case manager
    //needs to step out of their office and help the kitchen line.
    const fetchItems5 = async () => {
        try {
            const reportResponse = await fetch("/api/orders/past/day", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (reportResponse.ok) {
                const items = await reportResponse.json();
                setIncompleteOrdersList(items);
            } else {
                console.error("Failed to fetch items:", reportResponse.status);
            }

        }   catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    useEffect(() => {
        fetchItems5();
    },[]);


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
        setInputEmployeeClockin(employee.lastClockin);
        setInputEmployeeClockedIn(employee.isClockedin);
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
        setInputEmployeeClockin('00:00:00');
        setInputEmployeeClockedIn(false);
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
            position: inputEmployeePosition,
            lastClockin: inputEmployeeClockin, // Default to "00:00:00"
            isClockedin: inputEmployeeClockedIn,
            pin: inputEmployeePin,
        };

        try {
            const employeeResponse = await fetch("/api/employee/add", {
                method: "POST",
                headers: {
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
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedInventory)
        });

    };
    const deleteInventory = async () => {
        const invResponse = await fetch("/api/inventory/delete", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(invID)
        });
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

    const deleteMenuItem = async () => {

        const menuResponse = await fetch("/api/menuitem/delete", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(menuItemID)
        });
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
            lastClockin: inputEmployeeClockin,
            isClockedin: inputEmployeeClockedIn,
            pin: inputEmployeePin,
        };

        try {
            const employeeResponse = await fetch("/api/employee/update", {
                method: "PATCH",
                headers: {
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
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!employeeResponse.ok) {
                console.error("Failed to delete employee");
            } else {
                alert("Employee deleted successfully!");
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
        setInvID(event.target.value);
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
        setMenuItemID(event.target.value);
    }

    //Add and Delete Buttons
    const handleButton = () => {
        addToInventory();
        setInputValueName("");
        setInputValueAmount("");
        setInputValuePrice("");
    };
    const handleInvDelButton = () => {
        deleteInventory();
        setInvID('');
    }
    const handleMenuDelButton = () => {
        deleteMenuItem();
        setMenuItemID('');
    }
    const handleButtonMenu = () => {
        addToMenu();
        setInputMenuName("");
        setInputMenuCategory("");
        setInputMenuPrice("");
        setInputMenuIngredients("");
    };


    // Stats Handlers
    const handleStatsXReport = () => {
        setSelectedButton("xReport")
    }
    const handleStatsZReport = () => {
        setSelectedButton("zReport")
    }
    const handleStatsOrders = () => {
        setSelectedButton("Current Orders")
    }


    return (

        <div className="managerRoot">
            <div className="main-content">
                <h1>{selectedSection}</h1>
                <p>This is the {selectedSection} section.</p>

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
                                        <td><input type="text" value={item.name} onChange={(e) => handleInputChange(e, 'name', index)} /></td>
                                        <td><input type="text" value={item.amount} onChange={(e) => handleInputChange(e, 'amount', index)} /></td>
                                        <td><input type="text" value={item.servingPrice} onChange={(e) => handleInputChange(e, 'servingPrice', index)} /></td>
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
                        <input type="text" placeholder="Enter item Name" value={inputValueName} onChange={handleChange}/>
                        <input type="text" placeholder="Enter Stock Amount" value={inputValueAmount} onChange={handleChange2}/>
                        <input type="text" placeholder="Enter item servingPrice" value={inputValuePrice} onChange={handleChange3}/>
                        <button onClick={handleButton}> Add Item
                        </button>
                    </div>
                )}
                {selectedSection === "Inventory" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter item ID" value={invID} onChange={handleChange4}/>
                        <button onClick={handleInvDelButton}> DELETE Item
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
                                        <td> <button onClick={() => handleEditClickMenu(index)}>Edit</button>
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
                {selectedSection === "Menu Items" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter item ID" value={menuItemID} onChange={handleChangeMenu5}/>
                        <button onClick={handleMenuDelButton}> DELETE Item
                        </button>
                    </div>
                )}

                {selectedSection === "Employees" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Position</th>
                            <th>Clocked In</th>
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
                                        <td>{employee.isClockedin}</td>
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
                        <input type="text" placeholder="Enter Username" value={inputEmployeeUsername} onChange={(e) => setInputEmployeeUsername(e.target.value)}/>
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
                        <button onClick={addEmployee}>Add Employee</button>
                    </div>
                )}
                {selectedSection === "Statistics" && (
                    <div className="stats-btn">
                        <button onClick={handleStatsXReport}> xReport </button>
                        <button onClick={handleStatsZReport}> zReport </button>
                        <button onClick={handleStatsOrders}> Current Orders </button>

                        {selectedButton === "xReport" && (
                            <div>
                                <h3></h3>
                                <h3 className = "statsH3">xReport: {currentDateTime}</h3>
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
                                        <tr key={index}>
                                            <td>item.hour</td>
                                            <td>item.orders</td>
                                            <td>item.revenue</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedButton === "zReport" && (
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
                                    <tr key={index}>
                                        <td>item.hour</td>
                                        <td>item.orders</td>
                                        <td>item.revenue</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        {selectedButton === "Current Orders" && (
                            <div>
                                <h3></h3>
                                <h3 className = "statsH3">Current Orders: {currentDateTime}</h3>
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Orders</th>
                                        <th>Revenue</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {incompleteOrdersList.map((item, index) => (
                                        <tr key={index}>
                                            <td>item.hour</td>
                                            <td>item.orders</td>
                                            <td>item.revenue</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Manager;
