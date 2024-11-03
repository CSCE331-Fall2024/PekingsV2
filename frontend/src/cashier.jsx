import React, { useState } from 'react';
import './cashier.css';
import LeftRect from './components/cashier/LeftPane.jsx';
import CenterScreen from './components/cashier/CenterScreen.jsx';
import RightPane from './components/cashier/RightPane.jsx';

const ButtonScreen = () => {
    const [currentCenter, setCurrentCenter] = useState('menu');
    const [orderNum, setOrderNum] = useState(1);
    const [screens, setScreens] = useState([1]); // Track screens created
    const [activeScreenIndex, setActiveScreenIndex] = useState(0); // Index of the currently active screen

    const addScreen = () => {
        const newOrderNum = orderNum + 1;
        setOrderNum(newOrderNum);
        // Create a new instance of the screen
        setScreens(prevScreens => [...prevScreens, newOrderNum]);
        // Set the active screen to the newly created one
        setActiveScreenIndex(screens.length); // Show the new screen
    };

    const handleCenterChange = (center) => {
        setCurrentCenter(center);
    };

    const goToFirstScreen = () => {
        setActiveScreenIndex(0); // Go back to the first screen
    };

    return (
        <div>
            <button onClick={goToFirstScreen}>Go to First Order</button>
            <div className="screens-container">
                {screens.map((screenNum, index) => (
                    // Only render the currently active screen
                    <div className="cashierScreen" key={index} style={{ display: index === activeScreenIndex ? 'flex' : 'none' }}>
                        <LeftRect centerChange={handleCenterChange} addScreen={addScreen} />
                        <CenterScreen center={currentCenter} />
                        <RightPane orderNumber={screenNum} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ButtonScreen;
