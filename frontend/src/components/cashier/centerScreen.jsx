import React from 'react';
import './centerScreen.css'
import TopPane from './topPane.jsx';
import Menu from './menu.jsx';

function CenterScreen(){
    return(
        <div className="centerScreen">
            <TopPane />
            <Menu />
        </div>
    );
}

export default CenterScreen;