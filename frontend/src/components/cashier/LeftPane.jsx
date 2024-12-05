import React from 'react';
import './LeftPane.css';

/**
 * LeftRect Component
 *
 * The LeftRect component represents a left-hand side navigation pane with several buttons for user interactions, such as logging out,
 * viewing previous orders, creating a new order, navigating to the menu, and canceling an order.
 *
 * @component
 * @example
 * return (
 *   <LeftRect
 *     logout={handleLogout}
 *     centerChange={handleCenterChange}
 *     addScreen={handleAddScreen}
 *     handleCancel={handleCancelOrder}
 *     handleAccessibility={handleAccessibility}
 *   />
 * )
 *
 * @param {Function} logout - Function to trigger user logout or exit action
 * @param {Function} centerChange - Function to switch the main screen of the app (e.g. 'previous' for previous orders, 'menu' for menu screen)
 * @param {Function} addScreen - Function to initiate a new order when the "New Order" button is clicked
 * @param {Function} handleCancel - Function to cancel the current order when the "Cancel Order" button is clicked
 * @param {Function} handleAccessibility - Function to handle accessibility-related actions when the logo is clicked
 */
function LeftRect({ logout, centerChange, addScreen , handleCancel, handleAccessibility}) {
    return (
        <div className="leftRectangle">
            {/* Logo Button */}
            {/* Clicking the logo triggers the accessibility function */}
            <button className="logo-cash">
                <img className="logoButton" src="/images/pekingslogo.png" alt="Logo" />
            </button>

            {/* Exit Button */}
            {/* Clicking this button triggers the logout function */}
            {/*<button className="exit" onClick={() => logout()}>Exit</button>*/}
            {/*<div className="exit"></div>*/}

            <div className="leftRect3Btns-cash">
                {/* New Order Button */}
                {/* Clicking this button triggers the addScreen function to start a new order */}
                <button className="newOrder" onClick={addScreen}>
                    New<br/>Order
                </button>

                {/* View Previous Orders Button */}
                {/* Clicking this button triggers centerChange to show the previous orders screen */}
                <button className="viewPrevious" onClick={() => centerChange('previous')}>View<br/>Previous</button>

                {/* Menu Button */}
                {/* Clicking this button triggers centerChange to show the menu screen */}
                <button className="menuBtn" onClick={() => centerChange('menu')}>Menu</button>
            </div>

            {/* Cancel Order Button */}
            {/* Clicking this button triggers the handleCancel function to cancel the current order */}
            <button className="cancelOrder" onClick={() => handleCancel()}>Cancel Order</button>
        </div>
    );
}

export default LeftRect;
