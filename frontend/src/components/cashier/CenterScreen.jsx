import React, { useState, useEffect } from 'react';
import './CenterScreen.css'
import TopPane from './TopPane.jsx';
import Menu from './Menu.jsx';

/**
 * The `CenterScreen` component manages the central user interface in a POS system,
 * including displaying menus, handling order and payment processes, and providing manager options.
 *
 * It also supports alternate orders, PIN-based authentication for managers, and discount/refund functionalities.
 *
 * @component
 * @param {object} props - Component properties.
 * @param {string} props.center - Current screen being displayed (e.g., 'menu', 'previous', 'payment').
 * @param {object} props.order - The current order object, which contains details of the order.
 * @param {function} props.centerChange - A function to change the screen displayed in the center.
 * @param {Array} props.menuItemList - A list of menu items that are part of the current order.
 * @param {Array} props.alternateOrders - List of previous orders that can be viewed or edited.
 * @param {function} props.handlePreviousBtnClick - Function to handle the selection of a previous order.
 * @param {function} props.processOrder - Function to process the current order.
 * @param {function} props.setDiscount - Function to apply a discount to the current order.
 * @param {function} props.addScreen - Function to add a new screen or order.
 * @param {object} props.employee - The current logged-in employee, including details like position and PIN.
 *
 * @state
 * @state {Array} menuItems - List of menu items categorized as 'food', fetched from the server.
 * @state {Array} seasonalItems - List of seasonal menu items, fetched from the server.
 * @state {Array} drinks - List of drink menu items, fetched from the server.
 * @state {Array} employees - List of employees, fetched from the server for authentication purposes.
 * @state {string} currentMenu - Tracks the active menu or screen ('main', 'previous', 'payment', 'manager').
 * @state {string} inputValue - Tracks the current value entered in the PIN input field.
 * @state {string} placeHolderText - Text displayed in the PIN input field, used for feedback.
 * @state {Array} alternateOrderButtons - Dynamically generated list of buttons for previous orders.
 *
 * @methods
 * @method handleButtonClick - Handles the PIN input for employee authentication, checking if the PIN matches an employee.
 * @method handleClear - Clears the PIN input field and resets the placeholder text.
 * @method handlePaymentProcess - Processes the current order based on the selected payment type (cash or card).
 * @method handleMenuChange - Changes the current menu (e.g., 'main', 'previous', 'payment', 'manager').
 * @method setDiscountAmount - Sets the discount amount for the current order.
 * @method handleRefund - Handles the refund process for an order if it has been paid.
 * @method handleManagerOptionsClick - Displays manager options or asks for manager authentication based on employee position.
 *
 * @example
 * <CenterScreen
 *   center="menu"
 *   order={currentOrder}
 *   centerChange={changeScreen}
 *   menuItemList={menuList}
 *   alternateOrders={previousOrders}
 *   handlePreviousBtnClick={viewPreviousOrder}
 *   processOrder={processPayment}
 *   setDiscount={applyDiscount}
 *   addScreen={addNewOrder}
 *   employee={currentEmployee}
 * />
 *
 * @remarks
 * - Fetches menu data and employee information from the backend server on mount and refreshes every 10 seconds.
 * - Supports order processing with payment options (credit card, cash) and discounts.
 * - Allows managers to apply discounts and refunds, and view previous orders.
 */
// Memoize the CenterScreen component to avoid unnecessary re-renders
// eslint-disable-next-line react/display-name,react/prop-types
const CenterScreen = React.memo(({ center, order, centerChange, menuItemList,
                                     // eslint-disable-next-line react/prop-types
                                     alternateOrders, handlePreviousBtnClick, processOrder, setDiscount, addScreen, employee
}) => {

    const [menuItems, setMenuItems] = useState([]);
    const [seasonalItems, setSeasonalItems] = useState([]);
    const [drinks, setDrinks] = useState([]);

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


                    const list1 = items.filter(item => ( (item.category === "food") || (item.category === "dessert") ) && (item.active));
                    const list2 = items.filter(item => (item.category === "seasonal") && (item.active));
                    const list3 = items.filter(item => (item.category === "drink") && (item.active));

                    setMenuItems(list1);
                    setSeasonalItems(list2);
                    setDrinks(list3);
                } else {
                    console.error("Failed to fetch items:", response.status);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
        const interval = setInterval(fetchItems, 10000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);  // Add an empty dependency array to fetch items once on mount

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

        const interval = setInterval(fetchItems, 10000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);


    const [currentMenu, setCurrentMenu] = useState('main');
    const [inputValue, setInputValue] = useState('');
    const [placeHolderText, setPlaceHolderText] = useState('PIN');
    let alternateOrderButtons = [];

    const handleButtonClick = (number) => {
        let newPin = inputValue + number;

        for(let i = 0; i < employees.length; i++){
            if(newPin === employees[i].pin){
                centerChange("manager");
                setPlaceHolderText('PIN');
                setInputValue('');
                return;
            }
        }
        if (newPin.length === 4) {

            setPlaceHolderText('PIN not recognized');
            setInputValue('');
        } else {
            setInputValue(newPin);
        }
    };

    const handleClear = () => {
        setInputValue('');
        setPlaceHolderText('PIN');
    };

    for (let i = 0; i < alternateOrders.length; i++) {
        if (alternateOrders[i].status) {
            alternateOrderButtons.push(
                <button className="alternateOrderBtn-cash" onClick={() => { handlePreviousBtnClick(alternateOrders[i]) }} key={alternateOrders[i].id}>{alternateOrders[i].id}</button>
            );
        }
    }

    const handlePaymentProcess = (paymentType) => {
        setDiscount(0);
        processOrder(paymentType);
    };

    const handleMenuChange = (menu) => {
        setCurrentMenu(menu);
    };

    const setDiscountAmount = (num) => {
        setDiscount(num);
        centerChange('menu');
    }

    const handleRefund = () => {
        if (order.amountPaid === 0) {
            alert("Nothing to refund");
        } else {
            order.status = false;

            let refundText = "Refunded: $" + order.amountPaid.toFixed(2);
            alert(refundText);

            addScreen();
        }
    };


    const handleManagerOptionsClick = () => {
        if(employee.position === 'manager'){
            centerChange('manager');
        }else{
            centerChange('manager-confirm')
        }
    }


    return (
        <div className="centerScreen-cash">
            <div className="centerScreenContainers-cash" style={{ display: center === 'menu' ? 'block' : 'none' }}>
                <TopPane screenChange={handleMenuChange} />
                <Menu seasonalItems={seasonalItems} mainMenuItems={menuItems} drinks={drinks} currentMenu={currentMenu} menuItemList={menuItemList} />
            </div>

            <div className="centerScreenContainers-cash" style={{ display: center === 'previous' ? 'block' : 'none' }}>
                <div className="previousOrdersTitle-cash">Previous Orders</div>
                <div className="previousOrdersDisplayBox-cash">{alternateOrderButtons}</div>
            </div>

            <div className="centerScreenContainers-cash" style={{ display: center === 'payment' ? 'block' : 'none' }}>
                <div className="paymentButtons-cash">

                    <button className="card" onClick={() => handlePaymentProcess('credit_card')}>Card</button>
                    <button className="cash" onClick={() => handlePaymentProcess('cash')}>Cash</button>
                </div>
                <div className="managerOptionsContainer-cash">
                    <button className="managerOptions-cash" onClick={() => handleManagerOptionsClick()}>Manager Options</button>

                </div>
            </div>

            <div className="centerScreenContainers-cash" style={{ display: center === 'manager-confirm' ? 'flex' : 'none' }}>
                <div className="number-input-container">
                    <div className="input-field">
                        <input
                            type="text"
                            value={inputValue}
                            readOnly
                            className="number-input"
                            placeholder={placeHolderText}
                        />
                    </div>

                    <div className="button-grid">
                        <button className="number-button" onClick={() => handleButtonClick('1')}>1</button>
                        <button className="number-button" onClick={() => handleButtonClick('2')}>2</button>
                        <button className="number-button" onClick={() => handleButtonClick('3')}>3</button>
                        <button className="number-button" onClick={() => handleButtonClick('4')}>4</button>
                        <button className="number-button" onClick={() => handleButtonClick('5')}>5</button>
                        <button className="number-button" onClick={() => handleButtonClick('6')}>6</button>
                        <button className="number-button" onClick={() => handleButtonClick('7')}>7</button>
                        <button className="number-button" onClick={() => handleButtonClick('8')}>8</button>
                        <button className="number-button" onClick={() => handleButtonClick('9')}>9</button>
                        <button className="number-button" onClick={() => handleButtonClick('0')}>0</button>
                    </div>

                    <button onClick={handleClear} className="clear-button">Clear</button>
                </div>
            </div>

            <div className="centerScreenContainers-cash" style={{ display: center === 'manager' ? 'block' : 'none' }}>
                <div className="normalDiscount">
                    <button className="discountBtn" onClick={() => setDiscountAmount(0.1)}>10%</button>
                    <button className="discountBtn" onClick={() => setDiscountAmount(0.15)}>15%</button>
                    <button className="discountBtn" onClick={() => setDiscountAmount(0.2)}>20%</button>
                </div>
                <div className="specialDiscount">
                    <button className="employeeDiscountBtn" onClick={() => setDiscountAmount(0.5)}>Employee Discount</button>
                </div>

                <div className="refunds">
                    <button className="refundBtn" onClick={() => handleRefund()}>Refund</button>
                </div>
            </div>
        </div>
    );
});

export default CenterScreen;
