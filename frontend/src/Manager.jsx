import React, { useState, useEffect } from 'react';
import './Manager.css';

function Manager({ selectedSection }) {
    const [inventory, setInventory] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [editFormData, setEditFormData] = useState([]);
    const [originalFormData, setOriginalFormData] = useState([]);
    const [originalMenuItems, setOriginalMenuItems] = useState([]);

    const [inputValueName, setInputValueName] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [invID, setInvID] = useState('');
    const [menuItemID, setMenuItemID] = useState('');
    const [inputMenuName, setInputMenuName] = useState('');
    const [inputMenuActive, setInputMenuActive] = useState('');
    const [inputMenuIngredients, setInputMenuIngredients] = useState('');
    const [menuActive, setMenuActive] = useState(false);
    const [inputMenuPrice, setInputMenuPrice] = useState('');


    useEffect(() => {
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
        fetchItems();
    }, []);
    useEffect(() => {
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
        fetchItems2();
    },[]);
    useEffect(() => {
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
        fetchItems3();
    },[]);

    /*@PostMapping("/add")
    public Inventory addIngredient(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }*/


    // Edit for Inventory
    const handleEditClick = (index) => {
        setEditIdx(index);
        setOriginalFormData(inventory);
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
        setOriginalMenuItems(menuItems); };
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
    };
    // Function to handle canceling the edit for Menu Items
    const handleCancelMenu = () => {
        setEditIdx(-1);
        setMenuItems(originalMenuItems);
    };
    const addToInventory = async () => {
        //Replace this inv object with arbitrary object values
        // Make a function that will return an object with user defined values except ID.
        // set inv equal to what the function returns
        let amountt = parseInt(inputValueAmount);
        let pricee = parseInt(inputValuePrice);
        let batch = amountt * pricee;

        const inv = {
            id: parseInt(inventory[inventory.length-1].id) + 1,
            name: inputValueName,
            servingPrice: inputValuePrice,
            amount: inputValueAmount,
            priceBatch: batch,
        };
        setInventory([...inventory, inv]);

        const invResponse = await fetch("/api/inventory/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inv)
        });

    };
    const addToMenu = async () => {
        //Replace this inv object with arbitrary object values
        // Make a function that will return an object with user defined values except ID.
        // set inv equal to what the function returns

        const menu = {
            name: inputMenuName,
            price: inputMenuPrice,
            active: inputMenuActive,
            ingredients: [
                {
                    ingredient: inputMenuIngredients,
                    amount: -1,
                    menu_item: 3
                }
            ]
        };
        setMenuItems([...menuItems, menu]);

        const menuResponse = await fetch("/api/menuitem/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(menu)
        });

    };
    const updateInventory = async () => {

        const inv = await inventory.json();

        const invResponse = await fetch("/api/inventory/update", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inv)
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
        inventory.splice(Number(invID), 1);
        setInventory([...inventory]);
    };

    const deleteMenuItem = async () => {

        const menuResponse = await fetch("/api/menuitem/delete", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(menuItemID)
        });

        menuItems.splice(Number(menuItemID), 1);
        setMenuItems([...menuItems]);
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
        setInputMenuActive(event.target.value);
        if(inputMenuActive === "true"){
            setMenuActive(true);
        }
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
        setInvID("");
    }
    const handleMenuDelButton = () => {
        deleteMenuItem();
        setMenuItemID("");
    }
    const handleButtonMenu = () => {
        addToMenu();
        setInputMenuName("");
        setInputMenuActive("");
        setInputMenuPrice("");
        setInputMenuIngredients("");
    };

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
                        <input type="text" placeholder="set Active true/false" value={inputMenuActive}
                               onChange={handleChangeMenu3}/>
                        <input type="text" placeholder="ID Of Ingredient" value={inputMenuIngredients}
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
                            <th>User</th>
                            <th>Pass</th>
                            <th>Position</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index}>
                                <td>{employee.id}</td>
                                <td>{employee.username}</td>
                                <td>{employee.pass}</td>
                                <td>{employee.position}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Manager;
