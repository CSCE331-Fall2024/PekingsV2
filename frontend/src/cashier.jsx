import React from 'react';
import './cashier.css'
import LeftRect from './components/cashier/cashierLeftPane.jsx';
import CenterScreen from './components/cashier/centerScreen.jsx';
import RightPane from './components/cashier/rightPane.jsx';

const ButtonScreen = () => {
    return (
        <div className="cashierScreen">
            <LeftRect />
            <CenterScreen />
            <RightPane />
        </div>
    );
};

export default ButtonScreen;