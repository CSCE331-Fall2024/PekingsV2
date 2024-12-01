import React from 'react';
import '../../App.css';
import Application from '../Application';

/**
 * The `Career` component serves as a wrapper for the `Application` component.
 * This component is styled using global styles defined in `App.css`.
 *
 * @component
 * @returns {JSX.Element} A React functional component that renders the `Application` component.
 *
 * @example
 * // Basic usage
 * <Career />
 */

function Career() {
    return (
        <>
         <Application/>
        </>
    );
}

export default Career;