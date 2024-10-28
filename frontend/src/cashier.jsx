import React, {useState} from 'react';
import './cashier.css'
import LeftRect from './components/cashier/cashierLeftPane.jsx';
import CenterScreen from './components/cashier/centerScreen.jsx';
import RightPane from './components/cashier/rightPane.jsx';
import {getOrderItems} from "./components/cashier/menu.jsx";

const ButtonScreen = () => {


    return (
        <div className="cashierScreen">
            <LeftRect/>
            <CenterScreen/>
            <RightPane />
            {/*<button className="Test" onClick={() => {*/}
            {/*    console.log(getOrderItems());*/}
            {/*}}>Btn*/}
            {/*</button>*/}
        </div>
    );
};

export default ButtonScreen;