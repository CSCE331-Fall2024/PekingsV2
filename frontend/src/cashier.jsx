import React, {useState} from 'react';
import './cashier.css'
import LeftRect from './components/cashier/cashierLeftPane.jsx';
import CenterScreen from './components/cashier/centerScreen.jsx';
import RightPane from './components/cashier/rightPane.jsx';
import {getOrderItems} from "./components/cashier/menu.jsx";
// import {orderItems} from './components/cashier/centerScreen.jsx'

const ButtonScreen = () => {
    const orderItems = useState(getOrderItems());


    return (
        <div className="cashierScreen">
            <LeftRect />
            <CenterScreen />
            {RightPane(orderItems)}
            {/*<button className="Test" onClick={()=>{console.log(orderItems)}}>Btn</button>*/}
        </div>
    );
};

export default ButtonScreen;