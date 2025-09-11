import React, { useEffect, useState } from 'react';
import Village from '@villagehq/widget-sdk';
import './App.css';

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready for full-page modals');
  const publicKey = 'pk_SMhdS08sJc8UIIxDJbeN7lEeFekDcK9';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkZW50aWZpZXIiOiIxNTYiLCJwdWJsaWNfa2V5IjoicGtfelQ0SHpabjdvVjh4N2RnN1l1Q2pCRUc0MEFNNERoenUiLCJqdGkiOiIxMzNjMDIwOTllZDU0ZjBjMmEwYzQ2MGU0YTZjYmQ0OSIsImlhdCI6MTc1NzU5NzE4MiwiZXhwIjoxNzg5MTMzMTgyfQ.2m2-RCQ4n8NRY5gyIefh1j4rCgP_5wDHPo4xb-yHESc';
  useEffect(() => {
    const initPopup = async () => {
      try {
        setStatus('Initializing Village SDK...');
        
        // Initialize Village with your public key
        Village.init(publicKey);
        
        // Authorize with token
        try {
          const result = await Village.authorize(
            token,
            'yourdomain.com' 
          );
          
          if (result.ok) {
            setStatus('✅ Village ready with facepiles!');
            
            // Trigger widget rendering after successful auth
            setTimeout(() => {
              if ((window as any).Village._renderWidget) {
                (window as any).Village._renderWidget();
              }
            }, 100);
          } else {
            setStatus('✅ Village SDK loaded');
          }
        } catch (e) {
          setStatus('✅ Village SDK loaded');
        }
        
        // Make Village available globally (optional, for debugging)
        (window as any).Village = Village;
        
      } catch (error) {
        setStatus('❌ Failed to initialize Village SDK');
      }
    };

    initPopup();
  }, []);

  return (
    <>
      <div className="header">
        <h1>🏘️ Village Extension</h1>
        <div className="subtitle">Importable SDK</div>
      </div>
      
      <div className="main-container">
        <div className="status" id="status">{status}</div>
        
        {/* Find Intro Buttons Card */}
        <div className="intro-card">
          <h3>🤝 Find Intro Buttons</h3>
          <p>Get introductions using imported Village module - same HTML attributes work!</p>
          
          {/* Ziad Ibrahim */}
          <div className="person-row">
            <div className="person-name">Ziad Ibrahim</div>
            <button 
              village-data-url="https://www.linkedin.com/in/ziad-ibrahim-12391279/"
              className="intro-btn"
            >
              <span village-paths-availability="found" className="village-paths-found">
                <span village-paths-data="facepiles" className="facepiles-container"></span>
                <span village-paths-data="count"></span>
                <span className="paths-count-text">paths found →</span>
              </span>
              <span village-paths-availability="not-found">Get Intro →</span>
              <span village-paths-availability="loading" className="village-paths-loading">
                <svg className="loading-spinner" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                  <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            </button>
          </div>
          
          {/* 4dx ventures */}
          <div className="person-row">
            <div className="person-name">4dx ventures</div>
            <button 
              village-data-url="https://www.linkedin.com/company/4dx-ventures/"
              className="intro-btn"
            >
              <span village-paths-availability="found" className="village-paths-found">
                <span village-paths-data="facepiles" className="facepiles-container"></span>
                <span village-paths-data="count"></span>
                <span className="paths-count-text">paths found →</span>
              </span>
              <span village-paths-availability="not-found">Get Intro →</span>
              <span village-paths-availability="loading" className="village-paths-loading">
                <svg className="loading-spinner" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                  <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            </button>
          </div>
          
          {/* rafaelmuttoni */}
          <div className="person-row">
            <div className="person-name">rafaelmuttoni</div>
            <button 
              village-data-url="https://www.linkedin.com/in/rafaelmuttoni/"
              className="intro-btn"
            >
              <span village-paths-availability="found" className="village-paths-found">
                <span village-paths-data="facepiles" className="facepiles-container"></span>
                <span village-paths-data="count"></span>
                <span className="paths-count-text">paths found →</span>
              </span>
              <span village-paths-availability="not-found">Get Intro →</span>
              <span village-paths-availability="loading" className="village-paths-loading">
                <svg className="loading-spinner" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                  <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            </button>
          </div>
        </div>
        
        {/* Sync Network Section */}
        <div className="section">
          <h3 className="section-title">
            <span className="gradient-text">🔄 Sync Network</span>
          </h3>
          <p className="section-description">Sync your network to unlock more connection opportunities!</p>
          <button village-module="sync" className="sync-btn">
            <span className="sync-icon">🔄</span>
            Sync Network
          </button>
        </div>
        
        <div className="demo-note">
          <div className="success-indicator">
            <div className="success-circle">
              <span className="success-checkmark">✓</span>
            </div>
            <strong className="success-label">Success!</strong>
          </div>
          <p>All Village components loaded with importable SDK. Facepiles will appear when paths are found!</p>
        </div>
      </div>
    </>
  );
};

export default App;