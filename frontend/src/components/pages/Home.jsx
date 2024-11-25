import React from 'react';
import '../../App.css';
import CustomerHero from '../CustomerHero';

/**
 * The `Home` component serves as the main landing page for the application.
 * Currently renders the CustomerHero component as the primary content.
 *
 * @component
 * @returns {JSX.Element} The home page rendering CustomerHero
 *
 * @example
 * // Used in main routing configuration
 * <Route path="/" element={<Home />} />
 *
 * @remarks
 * - Provides a simple wrapper for the CustomerHero component
 * - Serves as the main entry point for the application's home page
 */

function Home() {
    return (
        <>
            <CustomerHero />
        </>
    );
}

export default Home;