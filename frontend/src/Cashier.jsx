import React, { useState } from 'react';
import './Cashier.css';
import LeftRect from './components/cashier/LeftPane.jsx';
import CenterScreen from './components/cashier/CenterScreen.jsx';
import RightPane from './components/cashier/RightPane.jsx';

function createOrder(orderID) {
    return {
        id: orderID,
        currentCenter: 'menu', // Each order has its own center state
        orderItems: [],
        paidItems: [],
        amountPaid: 0,
        status: true
    };
}

const Cashier = ({logout, employee}) => {
    const [orderNum, setOrderNum] = useState(1);
    const [screens, setScreens] = useState([createOrder(1)]); // Track screens created
    const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Index of the currently active screen
    const [processOrder, setProcessFunc] = useState([]); // A function to be passed into rightPane and set there
    const [discount, setDiscount] = useState(0);

    function getLastActive(){
        let lastActive = -1;
        for(let i = 0; i < screens.length; i++){
            if(screens[i].status){
                lastActive = screens[i].id;
            }
        }

        return lastActive;
    }

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
        if(order.id === activeScreenIndex + 1){
            handleCenterChange('menu');
        }else{
            screens[order.id - 1].currentCenter = 'menu';
            setActiveScreenIndex(order.id - 1);
        }
    };

    const handleCancel = () => {
        const orderNum = screens[activeScreenIndex].id;

        for(let i = 0; i < screens.length; i++) {
            if(screens[i].id === orderNum) {
                if(!(screens[i].paidItems.length)){
                    screens[i].status = false;
                }else{
                    screens[i].orderItems = [];
                    alert("Current order items cancelled");
                }
            }
        }

        let lastActive = getLastActive();
        if(lastActive === -1){ //If no other orders we create a new one
            addScreen();
        }else{ // If active orders exist, cancelling will send the screen to the last active order completed
            screens[lastActive - 1].currentCenter = 'menu';
            setActiveScreenIndex(lastActive - 1);
        }
    }


    return (
        <div>
            <div className="screens-container">
                {screens.map((order, index) => (
                    <div className="cashierScreen" key={index} style={{display: index === activeScreenIndex ? 'flex' : 'none'}}>
                        {/*<button onClick={() => console.log(order.status)}/>*/}
                        <LeftRect logout={logout} centerChange={handleCenterChange} addScreen={addScreen} handleCancel={handleCancel}/>
                        <CenterScreen center={order.currentCenter}
                                      order = {order}
                                      centerChange={handleCenterChange}
                                      menuItemList={order.orderItems}
                                      alternateOrders={screens} handlePreviousBtnClick={handlePrevOrderClick}
                                      processOrder={processOrder[activeScreenIndex]}
                                      setDiscount={setDiscount}
                                      addScreen={addScreen}
                        />
                        <RightPane order = {order}
                                   centerChange={handleCenterChange}
                                   setProcessFunction={setProcessFunc}
                                   processFunctions={processOrder}
                                   discount={discount}
                                   employee={employee}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cashier;
