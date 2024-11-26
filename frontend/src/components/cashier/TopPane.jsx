import React from 'react';
import './TopPane.css'

/**
 * The `TopPane` component provides a set of buttons for navigating between different
 * sections of the menu (Drinks, Main Menu, and Seasonal items).
 * It receives a `screenChange` function as a prop that is called when any of the
 * buttons are clicked, allowing the parent component to handle screen changes.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.screenChange - A function to handle the change of the current screen.
 *
 * @returns {JSX.Element} A navigation pane with buttons to change the screen view.
 *
 * @example
 * // Usage example
 * <TopPane screenChange={handleScreenChange} />
 *
 * @remarks
 * - This component is typically used as part of a larger menu interface where the user
 *   can switch between drinks, main menu, and seasonal items.
 */
function TopPane({screenChange}){
    return (
        <div className="topPane">
            <button className="drinksBtn" onClick={() => screenChange('drinks')}>Drinks</button>
            <button className="mainMenuBtn" onClick={() => screenChange('main')}>Main Menu</button>
            <button className="seasonalBtn" onClick={() => screenChange('seasonal')}>Seasonal</button>
        </div>
    );
}

export default TopPane;