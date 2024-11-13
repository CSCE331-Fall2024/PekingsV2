import React, { useState, useEffect } from 'react';
import './CenterScreen.css'
import TopPane from './TopPane.jsx';
import Menu from './Menu.jsx';

const pin = "1234";

// Memoize the CenterScreen component to avoid unnecessary re-renders
const CenterScreen = React.memo(({ center, order, centerChange, menuItemList, alternateOrders, handlePreviousBtnClick, processOrder, setDiscount, addScreen }) => {
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

                    const chunkSize = Math.floor(items.length / 3);
                    const remainder = items.length % 3;

                    const list1 = items.slice(0, chunkSize + (remainder > 0 ? 1 : 0));
                    const list2 = items.slice(list1.length, list1.length + chunkSize + (remainder > 1 ? 1 : 0));
                    const list3 = items.slice(list1.length + list2.length);

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
    }, []);  // Add an empty dependency array to fetch items once on mount

    const [currentMenu, setCurrentMenu] = useState('main');
    const [inputValue, setInputValue] = useState('');
    const [placeHolderText, setPlaceHolderText] = useState('PIN');
    let alternateOrderButtons = [];

    const handleButtonClick = (number) => {
        let newPin = inputValue + number;
        if (newPin === pin) {
            centerChange("manager");
            setPlaceHolderText('PIN');
            setInputValue('');
        } else if (newPin.length === 4) {
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
                    <button className="managerOptions-cash" onClick={() => centerChange('manager-confirm')}>Manager Options</button>
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
