import React from 'react';
import '../App.css';
import { Button } from './Button';
import './CustomerHero.css';

function CustomerHero() {  // Changed name to match the file name
    return (
        <div className='hero-container'>
            {/* Update image path to match your public directory structure */}
            <img src="/images/bluemarble.png" alt="Blue Marble" />
        </div>
    );
}

export default CustomerHero;