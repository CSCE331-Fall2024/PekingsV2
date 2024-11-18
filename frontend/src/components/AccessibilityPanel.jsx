import React, { useState, useEffect } from 'react';
import './AccessibilityPanel.css';

const AccessibilityPanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(false);

  const toggleHighContrastMode = () => {
    setIsHighContrast((prev) => !prev);
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.classList.toggle('high-contrast', !isHighContrast);
    }
  };

  const toggleMagnifier = () => {
    setIsMagnifierEnabled((prev) => !prev);
    document.body.classList.toggle('magnifier-enabled', !isMagnifierEnabled);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMagnifierEnabled) return;
      const magnifier = document.querySelector('.app-content::after');
      if (magnifier) {
        magnifier.style.left = `${e.clientX}px`;
        magnifier.style.top = `${e.clientY}px`;
      }
    };

    if (isMagnifierEnabled) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isMagnifierEnabled]);

  return (
    <div className="accessibility-container">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="accessibility-toggle"
        aria-label="Toggle Accessibility Options"
      >
        <img
          src="/images/handicap.png"
          alt="Accessibility"
          width="24"
          height="24"
        />
      </button>

      {isPanelOpen && (
        <div className="accessibility-panel">
          <div className="accessibility-row">
            <label className="accessibility-label">
              High Contrast
              <button
                onClick={toggleHighContrastMode}
                className="accessibility-toggle-button"
                aria-pressed={isHighContrast}
              >
                <div
                  className="accessibility-toggle-knob"
                  style={{
                    '--toggle-knob-position': isHighContrast ? '26px' : '2px',
                    '--toggle-background': isHighContrast
                      ? '#4CAF50'
                      : '#e2e2e2',
                  }}
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
