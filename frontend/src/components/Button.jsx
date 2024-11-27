import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

/**
 * The `Button` component creates a reusable, styled button with routing capabilities.
 * It allows for customization of button style, size, and provides a default Link to '/sign-up'.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Button content to be rendered
 * @param {string} [props.type] - HTML button type (e.g., 'button', 'submit')
 * @param {Function} [props.onClick] - Click event handler
 * @param {string} [props.buttonStyle] - Predefined button style class
 * @param {string} [props.buttonSize] - Predefined button size class
 *
 * @constant {string[]} STYLES - Predefined button style options
 * @constant {string[]} SIZES - Predefined button size options
 *
 * @returns {JSX.Element} A styled button wrapped in a React Router Link
 *
 * @example
 * <Button 
 *   type="button" 
 *   buttonStyle="btn--primary" 
 *   buttonSize="btn--large"
 *   onClick={handleClick}
 * >
 *   Click Me
 * </Button>
 *
 * @remarks
 * - Defaults to primary style and medium size if not specified
 * - Always links to '/sign-up' route
 * - Applies CSS classes dynamically based on provided props
 */

const STYLES = ['btn--primary', 'btn--outline', 'btn--test'];

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
  );
};