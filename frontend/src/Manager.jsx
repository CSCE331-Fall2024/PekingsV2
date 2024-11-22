import React, { useState, useEffect } from 'react';
import './Manager.css';

function Manager({ selectedSection }) {
    const [inventory, setInventory] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);
    const [inputValueName, setInputValueName] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState('');
    const [inputValuePrice, setInputValuePrice] = useState('');
    const [inputMenuName, setInputMenuName] = useState('');
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


    // const handleEditClick = (index) => {
    //     setEditIdx(index);
    // };
    //
    // const handleInputChange = (e, field, index) => {
    //     const updatedInventory = inventory.map((item, idx) => {
    //         if (idx === index) {
    //             return { ...item, [field]: e.target.value };
    //         }
    //         return item;
    //     });
    //     setInventory(updatedInventory);
    // };
    //
    // const handleSave = () => {
    //     setEditIdx(-1);
    // };
    //
    // const handleCancel = () => {
    //     setEditIdx(-1);
    // };
    // useEffect(() => {
    //     const addInventory = async () => {
    //         {
    //             "customer": { "id": 503 },
    //             "employee": { "id": 3 },
    //             "time": "2024-11-13T02:47:03.484Z",
    //             "price": 10.63,
    //             "payment_method": "credit_card",
    //             "items": [
    //             {
    //                 "menuItem": { "id": 6 },
    //                 "extras": [
    //                     {
    //                         "ingredient": {
    //                             "id": 5
    //                         },
    //                         "amount": -1
    //                     }
    //                 ]
    //             }
    //         ]
    //         }[]);
    // get inventory mapped array...already at top "inventory"
    // setInventory will add to last element.
    // add will be used to add to new database section.
    // Use Postman to get layout of inventory items
    // Create popup that opens to list that follows.
    // Popup opens a textbox that lets you input all except ID as that will get randomized
    //



    const addToInventory = async () => {
        //Replace this inv object with arbitrary object values
        // Make a function that will return an object with user defined values except ID.
        // set inv equal to what the function returns
        let amountt = parseInt(inputValueAmount);
        let pricee = parseInt(inputValuePrice);
        let batch = amountt * pricee;

        const mItems = {
            id: parseInt(inventory[inventory.length-1].id) + 1,
            name: inputValueName,
            servingPrice: inputValuePrice,
            amount: inputValueAmount,
            priceBatch: batch,
        };
        setMenuItems([...menuItems, mItems]);

        const invResponse = await fetch("/api/inventory/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mItems)
        });

    };
    const addToMenu = async () => {
        //Replace this inv object with arbitrary object values
        // Make a function that will return an object with user defined values except ID.
        // set inv equal to what the function returns

        const menu = {
            id: parseInt(inventory[inventory.length-1].id) + 1,
            name: inputValueName,
            servingPrice: inputValuePrice,
            amount: inputValueAmount,
            priceBatch: batch,
        };
        setInventory([...inventory, inv]);

        const menuResponse = await fetch("/api/inventory/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(menu)
        });

    };
    // const deleteInventory = async () => {
    //
    //     //Function call to return inventory id
    //
    //
    //     useEffect(() => {
    //         const deleteInventoryItem = async () => {
    //             const invDelRespone = await fetch("/api/inventory/delete", {
    //                 method: "DELETE",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(deleteInventoryItem),
    //             });
    //         }
    //     },[]);
    // };


    const handleChange = (event) => {
        setInputValueName(event.target.value);
        setInputMenuName(event.target.value);

    };
    const handleChange2 = (event) => {
        setInputValueAmount(event.target.value);
    };
    const handleChange3 = (event) => {
        setInputValuePrice(event.target.value);
        setInputMenuPrice(event.target.value);
    };
    const handleButton = () => {
        addToInventory();
        setInputValueName("");
        setInputValueAmount("");
        setInputValuePrice("");
    }
    const handleButtonMenu = () => {
        addToMenu();
        setInputMenuName("");
        setInputValuePrice("");
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
                            {/*<th>Actions</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {inventory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                <td>${item.servingPrice}</td>
                                <td>${item.priceBatch}</td>
                                {/*<td>{item.actions}</td>*/}
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

                {selectedSection === "Menu Items" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Menu Item</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menuItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {selectedSection === "Menu Items" && (
                    <div className="add-button">
                        <input type="text" placeholder="Enter item Name" value={inputMenuName} onChange={handleChangeMenu}/>
                        <input type="text" placeholder="Enter Stock Amount" value={inputMenuPrice} onChange={handleChangeMenu2}/>
                        <button onClick={handleButtonMenu}> Add Item
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
