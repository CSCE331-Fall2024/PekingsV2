import React from 'react';
import '../App.css';
import { Button } from './Button';
import './CustomerHero.css';
import DuckMascot from './DuckMascot';

function CustomerHero() {
    return (
        <div className='hero-container'>
            <div className='content-wrapper'>
                <div className='video-section'>
                    <div className='video-container'>
                        <video
                            autoPlay
                            loop
                            muted
                            className='background-video'
                        >
                            <source src="/videos/asiancooking.mp4" type="video/mp4" />
                        </video>
                        <div className='video-overlay'></div>
                        <div className='title-content'>
                            <div className='title-wrapper'>
                                <h1>PeKings</h1>
                                <p>Our mission is to deliver ducking awesome food right to you.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='marble-section'></div>
                
            </div>
            <DuckMascot />
        </div>
    );
}

export default CustomerHero;