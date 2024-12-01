import React from 'react';
import '../../App.css';
import MenuSect from '../MenuSect';

/**
 * The `MenuBoard` component serves as a wrapper for the MenuSect component.
 * It provides a simple routing container for displaying the menu section.
 *
 * @component
 * @returns {JSX.Element} A fragment containing the MenuSect component
 *
 * @example
 * // Used in main routing configuration
 * <Route path="/menu" element={<MenuBoard />} />
 *
 * @remarks
 * - Acts as a pass-through component for the MenuSect
 * - Potentially allows for future expansion or additional menu-related components
 */

function MenuBoard() {
    return (
        <>
            <MenuSect />
        </>
    );
}

export default MenuBoard;

