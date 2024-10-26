import React, { useState } from 'react';
import './DuckMascot.css';

const DuckMascot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDuck = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="duck-mascot-container">
            <img 
                src={isOpen ? '/images/duckopen.png' : '/images/duckidle.png'} 
                alt="Duck Mascot"
                className="duck-mascot"
                onClick={toggleDuck}
            />
        </div>
    );
};

export default DuckMascot;