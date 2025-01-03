import React, { useState } from 'react';
import './Cashier.css';
import LeftRect from './components/cashier/LeftPane.jsx';
import CenterScreen from './components/cashier/CenterScreen.jsx';
import RightPane from './components/cashier/RightPane.jsx';
import {useLocation} from "react-router-dom";

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

/**
 * The `Cashier` component manages the cashier interface for handling orders, including order creation,
 * order cancellation, and accessibility features such as high contrast mode. It interacts with multiple
 * order screens and offers functionality for both cashier and manager roles.
 *
 * @component
 * @returns {JSX.Element} A dynamic cashier interface allowing order management, screen switching,
 *                        and accessibility toggling.
 *
 * @state
 * @state {number} orderNum - The number representing the current order number.
 * @state {Array<Object>} screens - A list of order screens, each representing an active order.
 * @state {number} activeScreenIndex - The index of the currently active screen.
 * @state {Array<function>} processOrder - A list of functions for processing orders on each screen.
 * @state {number} discount - The discount applied to the current order.
 * @state {boolean} isManagerLogoutOpen - Flag to determine if manager logout options are visible.
 * @state {boolean} isPopupOpen - Flag to indicate if the accessibility popup is open.
 * @state {boolean} isHighContrast - Flag indicating whether high contrast mode is enabled.
 *
 * @methods
 * @method addScreen - Adds a new order screen to the list of screens.
 * @method handleCenterChange - Updates the center content of the currently active screen.
 * @method handlePrevOrderClick - Switches to a different order screen.
 * @method handleCancel - Cancels the current order and handles screen change.
 * @method handlePopupOpen - Opens the accessibility popup to toggle high contrast mode.
 * @method handlePopupClose - Closes the accessibility popup.
 * @method toggleHighContrastMode - Toggles the high contrast mode for the UI.
 * @method handleLogout - Handles the logout process, opening manager logout options if the employee is a manager.
 *
 * @effects
 * @effect Dynamically renders the cashier interface, including order screens and accessibility controls.
 * - Handles the addition of new screens and changes to active screen content.
 * - Updates UI based on user interactions such as canceling orders or toggling high contrast.
 *
 * @example
 * // Rendered in main App component
 * <Cashier logout={logoutFunction} employee={employeeData} setIsTranslateVisible={setTranslateVisible} switchToManager={switchToManagerFunction} />
 *
 * @remarks
 * - Supports both cashier and manager functionalities, including different logout options for each role.
 * - Includes an accessibility panel for toggling high contrast mode to aid users with visual impairments.
 */
const Cashier = ({logout, setIsTranslateVisible, switchToManager}) => {
    const [orderNum, setOrderNum] = useState(1);
    const [screens, setScreens] = useState([createOrder(1)]); // Track screens created
    const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Index of the currently active screen
    const [processOrder, setProcessFunc] = useState([]); // A function to be passed into rightPane and set there
    const [discount, setDiscount] = useState(0);
    const [isManagerLogoutOpen, setIsManagerLogoutOpen] = useState(false);

    const location = useLocation();
    console.log(location.state)
    const employee = location.state.employee

    if (!employee) {
        console.error("Employee data is missing from location.state!");
        return <div>No employee data provided.</div>;
    }

    function getLastActive(){
        let lastActive = -1;
        for(let i = 0; i < screens.length; i++){
            if(screens[i].status) {
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
        if(!(screens[activeScreenIndex].paidItems.length)){
            screens[activeScreenIndex].status = false;

            let lastActive = getLastActive();
            if(lastActive === -1){ //If no other orders we create a new one
                addScreen();
            }else{ // If active orders exist, cancelling will send the screen to the last active order completed
                screens[lastActive - 1].currentCenter = 'menu';
                setActiveScreenIndex(lastActive - 1);
                console.log(lastActive - 1);
            }
        }else{
            screens[activeScreenIndex].orderItems = [];
            handleCenterChange('menu');
            alert("Current order items cancelled");
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
                        <LeftRect logout={logout} centerChange={handleCenterChange} addScreen={addScreen} handleCancel={handleCancel}/>
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
                <div className="Screen-Popup">
                    <button className="close-button" onClick={() => setIsManagerLogoutOpen(false)}>X</button>
                    <div className="logout-options">
                        <button className="logout-option logout" onClick={() => logout()}>Logout</button>
                        <button className="logout-option manager" onClick={() => switchToManager()}>Manager</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashier;
