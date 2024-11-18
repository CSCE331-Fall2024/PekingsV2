import React, { useState, useEffect } from 'react';
import './Manager.css';

function Manager({ selectedSection }) {
    const [inventory, setInventory] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editIdx, setEditIdx] = useState(-1);

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
    useEffect(() => {
        const addInventoryItem = async () => {
            const invResponse = await fetch("/api/inventory/add", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    },[]);


    return (
        <div className="managerRoot">
            <div className="main-content">
                <h1>{selectedSection}</h1>
                <p>This is the {selectedSection} section.</p>

                {/* Conditional Rendering for Table Layout */}
                {selectedSection === "Inventory" && (
                    <div className="add button">
                        <button onClick={() => }>Add Item</button>
                    </div>
                    <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ingredient</th>
                            <th>Quantity</th>
                            {/*<th>Unit Price</th>*/}
                            {/*<th>Batch Price</th>*/}
                            {/*<th>Actions</th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {inventory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                {/*<td>${item.servingPrice}</td>*/}
                                {/*<td>${item.priceBatch}</td>*/}
                                {/*<td>{item.actions}</td>*/}
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                {/*"id": 1,*/}
                {/*"username": "ThomasC",*/}
                {/*"pass": "CC137",*/}
                {/*"email": null,*/}
                {/*"position": "employee",*/}
                {/*"lastClockin": "00:00:00",*/}
                {/*"isClockedin": false,*/}
                {/*"pin": null*/}
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
