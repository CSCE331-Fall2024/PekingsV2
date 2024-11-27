import React, { useState} from 'react';
import './AccessibilityPanel.css';

/**
 * The `AccessibilityPanel` component provides user-friendly accessibility options.
 * Currently supports a high contrast mode toggle for improved visual accessibility.
 *
 * @component
 * @returns {JSX.Element} An accessibility control panel with toggle functionality
 *
 * @state
 * @state {boolean} isPanelOpen - Controls visibility of accessibility options
 * @state {boolean} isHighContrast - Tracks high contrast mode state
 *
 * @methods
 * @method toggleHighContrastMode - Switches high contrast mode on/off
 * - Applies 'high-contrast' class to app content
 * - Updates state to reflect current mode
 *
 * @example
 * <AccessibilityPanel />
 *
 * @remarks
 * - Provides a button to toggle accessibility options
 * - Implements high contrast mode for improved readability
 * - Uses CSS class manipulation for visual changes
 */

const AccessibilityPanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);


  const toggleHighContrastMode = () => {
    setIsHighContrast((prev) => !prev);
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.classList.toggle('high-contrast', !isHighContrast);
    }
  };

  return (
    <div className="accessibility-container">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="accessibility-toggle"
        aria-label="Toggle Accessibility Options"
      >
        <img src="/images/handicap.png" alt="Accessibility"/>
      </button>

      {isPanelOpen && (
        <div className="accessibility-panel">
          <div className="accessibility-row">
            <label className="accessibility-label">
              High Contrast
              <button onClick={toggleHighContrastMode}
                className="accessibility-toggle-button"
                aria-pressed={isHighContrast}
              >
                <div
                  className="accessibility-toggle-knob"
                  style={{'--toggle-knob-position': isHighContrast ? '26px' : '2px','--toggle-background': isHighContrast? '#4CAF50' : '#e2e2e2',}}
                />
              </button>
            </label>
          </div>


        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;
