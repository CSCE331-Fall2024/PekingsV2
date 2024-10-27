import React, { useState } from 'react';
import './cashier.css'

const ButtonScreen = () => {
    const [message, setMessage] = useState('');

    const handleButtonClick = (buttonName) => {
        setMessage(`You clicked: ${buttonName}`);
    };

    return (
        <div className = "cashierScreen">
            <div className = "leftRectangle">

            </div>
        </div>
    );
};

export default ButtonScreen;