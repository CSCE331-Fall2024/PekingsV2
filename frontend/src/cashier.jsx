import React, { useState } from 'react';
import './cashier.css';
import LeftRect from './components/cashier/LeftPane.jsx';
import CenterScreen from './components/cashier/CenterScreen.jsx';
import RightPane from './components/cashier/RightPane.jsx';

function createOrder(orderID) {
    return {
        id: orderID,
        currentCenter: 'menu', // Each order has its own center state
        orderItems: [],
        status: true
    };
}

const ButtonScreen = () => {
    const [orderNum, setOrderNum] = useState(1);
    const [screens, setScreens] = useState([createOrder(1)]); // Track screens created
    const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Index of the currently active screen

    const addScreen = () => {
        const newOrderNum = orderNum + 1;
        setOrderNum(newOrderNum);
        setScreens(prevScreens => [...prevScreens, createOrder(newOrderNum)]);
        setActiveScreenIndex(newOrderNum - 1); // Show the new screen
    };

    const handleCenterChange = (center) => {
        setScreens(prevScreens => {
            const updatedScreens = [...prevScreens];
            updatedScreens[activeScreenIndex].currentCenter = center; // Update only the active screen's center
            return updatedScreens;
        });
    };

    const handlePrevOrderClick = (order) => {
        console.log(order.id);
        screens[order.id - 1].currentCenter = 'menu';
        setActiveScreenIndex(order.id - 1);
    };

    const handleCancel = (order) => {
        const orderNum = order.id;
        for(let i = 0; i < screens.length; i++) {
            if(screens[i].id === orderNum) {
                screens[i].status = false;
            }
        }
    }


    return (
        <div>
            <div className="screens-container">
                {screens.map((order, index) => (
                    <div className="cashierScreen" key={index} style={{ display: index === activeScreenIndex ? 'flex' : 'none' }}>
                        <LeftRect centerChange={handleCenterChange} addScreen={addScreen} />
                        <CenterScreen center={order.currentCenter} menuItemList={order.orderItems} alternateOrders={screens} handlePreviousBtnClick={handlePrevOrderClick} />
                        <RightPane orderNumber={order.id} orderItems={order.orderItems} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ButtonScreen;
