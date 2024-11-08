import React, { useState, useEffect } from 'react';
import './Manager.css';
// import './Display.css';

function Manager({ selectedSection }) {
    const [inventory, setInventory] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Generate random inventory data
        const ingredientList = [
            'Rice', 'Noodles', 'Soy Sauce', 'Ginger', 'Garlic', 'Green Onion',
            'Tofu', 'Mushrooms', 'Bok Choy', 'Bean Sprouts', 'Bell Pepper',
            'Egg', 'Sesame Oil', 'Chicken', 'Pork', 'Beef', 'Shrimp'
        ];

        const generateRandomInventory = () => {
            return ingredientList.map((item) => ({
                name: item,
                quantity: Math.floor(Math.random() * 100) + 1,
                price: (Math.random() * 10).toFixed(2)
            }));
        };

        // Generate random menu items data
        const menuList = ['Sweet and Sour Pork', 'Kung Pao Chicken', 'Spring Rolls', 'Dumplings', 'Hot and Sour Soup'];

        const generateRandomMenuItems = () => {
            return menuList.map((item) => ({
                name: item,
                price: (Math.random() * (10 - 8) + 8).toFixed(2) // Random price between 8 and 10
            }));
        };

        // Define employees list
        const employeeList = [
            { id: 1, name: "Nathan M.", role: "Manager" },
            { id: 2, name: "Nathan L.", role: "Manager" },
            { id: 3, name: "Fabio", role: "Employee" },
            { id: 4, name: "Jeremiah", role: "Employee" }
        ];

        setInventory(generateRandomInventory());
        setMenuItems(generateRandomMenuItems());
        setEmployees(employeeList);
    }, []);

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
                            <th>Ingredient</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price}</td>
                                <td>
                                <button className="invButton_M">Edit</button>
                                </td>
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

                {selectedSection === "Employees" && (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            <th>ID</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.id}</td>
                                <td>{employee.role}</td>
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
