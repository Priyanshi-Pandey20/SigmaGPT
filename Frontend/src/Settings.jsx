import React from "react";
import "./Settings.css";

function Settings({ onClose, settings, setSettings, onClearChat, onDeleteAll }) {
  const update = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2><i className="fa-solid fa-gear"></i> Settings</h2>
          <span onClick={onClose}><i className="fa-solid fa-x"></i></span>
        </div>

        <div className="settings-body">

          {/* Chat Behaviour */}
          <p className="section-label">Chat behaviour</p>
          <div className="settings-section">
            <div className="settings-row">
              <div className="row-left">
                <i className="fa-solid fa-turn-down"></i>
                <div>
                  <div className="row-text">Send on Enter</div>
                  <div className="row-sub">Press Enter to send messages</div>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.sendOnEnter}
                  onChange={(e) => update("sendOnEnter", e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-row">
              <div className="row-left">
                <i className="fa-solid fa-arrow-down"></i>
                <div>
                  <div className="row-text">Auto-scroll</div>
                  <div className="row-sub">Scroll to latest message</div>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.autoScroll}
                  onChange={(e) => update("autoScroll", e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-row">
              <div className="row-left">
                <i className="fa-solid fa-font"></i>
                <div><div className="row-text">Font size</div></div>
              </div>
              <select value={settings.fontSize}
                onChange={(e) => update("fontSize", e.target.value)}>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>

          {/* Voice */}
          <p className="section-label">Voice</p>
          <div className="settings-section">
            <div className="settings-row">
              <div className="row-left">
                <i className="fa-solid fa-globe"></i>
                <div><div className="row-text">Mic language</div></div>
              </div>
              <select value={settings.micLang}
                onChange={(e) => update("micLang", e.target.value)}>
                <option value="en-US">English (US)</option>
                <option value="en-IN">English (IN)</option>
                <option value="hi-IN">Hindi</option>
                <option value="es-ES">Spanish</option>
              </select>
            </div>
            <div className="settings-row">
              <div className="row-left">
                <i className="fa-solid fa-volume-high"></i>
                <div>
                  <div className="row-text">Read replies aloud</div>
                  <div className="row-sub">Text-to-speech for replies</div>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.tts}
                  onChange={(e) => update("tts", e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

        
        </div>

        <div className="settings-footer">
          <button className="save-btn" onClick={onClose}>Save settings</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;