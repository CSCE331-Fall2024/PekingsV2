import React, { useState} from 'react';
import './AccessibilityPanel.css';

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
