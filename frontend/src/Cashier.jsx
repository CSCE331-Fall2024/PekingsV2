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

const Cashier = ({logout, employee, setIsTranslateVisible, switchToManager}) => {
    const [orderNum, setOrderNum] = useState(1);
    const [screens, setScreens] = useState([createOrder(1)]); // Track screens created
    const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Index of the currently active screen
    const [processOrder, setProcessFunc] = useState([]); // A function to be passed into rightPane and set there
    const [discount, setDiscount] = useState(0);
    const [isManagerLogoutOpen, setIsManagerLogoutOpen] = useState(false);

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

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
        setIsTranslateVisible(true);
        window.scrollTo(0, 0);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setIsTranslateVisible(false);
    };

    const [isHighContrast, setIsHighContrast] = useState(false);


    const toggleHighContrastMode = () => {
        setIsHighContrast((prev) => !prev);
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            const isHighContrastMode = appContent.classList.contains('high-contrast');
            appContent.classList.toggle('high-contrast', !isHighContrastMode);
        }
    };

    function handleLogout(){
        if(employee.position === "manager"){
            setIsManagerLogoutOpen(true);
        }else{
            logout();
        }
    }


    return (
        <div>
            { (isPopupOpen && !isManagerLogoutOpen) && (
                <div className="Screen-Popup">
                    <button className="close-button" onClick={() => handlePopupClose()}>X</button>
                    <div className="accessibility-panel-kitchen">
                        <div className="accessibility-row">
                            <label className="accessibility-label">
                                High Contrast
                                <button onClick={toggleHighContrastMode}
                                        className="accessibility-toggle-button"
                                        aria-pressed={isHighContrast}
                                >
                                    <div
                                        className="accessibility-toggle-knob"
                                        style={{
                                            '--toggle-knob-position': isHighContrast ? '26px' : '2px',
                                            '--toggle-background': isHighContrast ? '#4CAF50' : '#e2e2e2',
                                        }}
                                    />
                                </button>
                            </label>
                        </div>
                    </div>
                </div>
            )}
            { (!isPopupOpen && !isManagerLogoutOpen) && (
            <div className="screens-container">
                {screens.map((order, index) => (
                    <div className="cashierScreen" key={index} style={{display: index === activeScreenIndex ? 'flex' : 'none'}}>
                        <LeftRect logout={handleLogout} centerChange={handleCenterChange} addScreen={addScreen} handleCancel={handleCancel} handleAccessibility={handlePopupOpen} />
                        <CenterScreen center={order.currentCenter}
                                      order = {order}
                                      centerChange={handleCenterChange}
                                      menuItemList={order.orderItems}
                                      alternateOrders={screens} handlePreviousBtnClick={handlePrevOrderClick}
                                      processOrder={processOrder[activeScreenIndex]}
                                      setDiscount={setDiscount}
                                      addScreen={addScreen}
                                      employee={employee}
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
            )}
            { (isManagerLogoutOpen && !isPopupOpen) && (
                <div>
                    <button className="close-button" onClick={() => setIsManagerLogoutOpen(false)}>X</button>
                    <div className="logout-options">
                        <button className="logout-option" onClick={() => logout()}>Logout</button>
                        <button className="logout-option" onClick={() => switchToManager()}>Manager</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashier;
