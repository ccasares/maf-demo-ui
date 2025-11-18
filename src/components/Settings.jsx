import { useState, useEffect } from 'react'
import { IoCheckmarkCircle, IoAlertCircle, IoTimeOutline, IoTrashOutline } from 'react-icons/io5'
import { isValidURL } from '../utils/cookies'
import { generateColorScheme } from '../utils/colorUtils'
import './Settings.css'

function Settings({ brokerConfig, brokerUrlHistory, onSaveBrokerUrl, onClearBrokerUrlHistory, onDeleteUrlFromHistory, promptDecorator, onSavePromptDecorator, customization, onSaveCustomization }) {
  const [activeTab, setActiveTab] = useState('broker')
  const [url, setUrl] = useState(brokerConfig?.url || '')
  const [name, setName] = useState(brokerConfig?.name || '')
  const [isValid, setIsValid] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [touched, setTouched] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  // Prompt Decorator state
  const [decoratorEnabled, setDecoratorEnabled] = useState(promptDecorator?.enabled || false)
  const [decoratorText, setDecoratorText] = useState(promptDecorator?.text || '')
  
  // Customization state
  const [customLogo, setCustomLogo] = useState(customization?.logo || null)
  const [customTitle, setCustomTitle] = useState(customization?.title || 'Conversation')
  const [customColorScheme, setCustomColorScheme] = useState(customization?.colorScheme || '')
  const [showCustomizeSuccess, setShowCustomizeSuccess] = useState(false)
  const [logoError, setLogoError] = useState(null)
  const [showDecoratorSuccess, setShowDecoratorSuccess] = useState(false)

  useEffect(() => {
    setUrl(brokerConfig?.url || '')
    setName(brokerConfig?.name || '')
  }, [brokerConfig])

  useEffect(() => {
    setDecoratorEnabled(promptDecorator?.enabled || false)
    setDecoratorText(promptDecorator?.text || '')
  }, [promptDecorator])

  useEffect(() => {
    setCustomLogo(customization?.logo || null)
    setCustomTitle(customization?.title || 'Conversation')
    setCustomColorScheme(customization?.colorScheme || '')
  }, [customization])

  const validateUrl = (value) => {
    if (!value.trim()) {
      return true // Allow empty field
    }
    return isValidURL(value)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setUrl(value)
    setShowSuccess(false)
    
    if (touched) {
      setIsValid(validateUrl(value))
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setIsValid(validateUrl(url))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    
    const valid = validateUrl(url)
    setIsValid(valid)
    
    if (valid && url.trim()) {
      onSaveBrokerUrl({ url: url.trim(), name: name.trim() })
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }

  const canSave = url.trim() && isValid && (url !== brokerConfig?.url || name !== brokerConfig?.name)

  const handleSelectFromHistory = (historyItem) => {
    setUrl(historyItem.url)
    setName(historyItem.name || '')
    setShowHistory(false)
    setIsValid(true)
    setTouched(true)
  }

  const handleClearHistory = () => {
    onClearBrokerUrlHistory()
    setShowHistory(false)
  }

  const handleDeleteUrl = (e, urlToDelete) => {
    e.stopPropagation() // Prevent selecting the URL when clicking delete
    onDeleteUrlFromHistory(urlToDelete)
  }

  const handleDecoratorSubmit = (e) => {
    e.preventDefault()
    
    const decoratorData = {
      enabled: decoratorEnabled,
      text: decoratorText.trim()
    }
    
    onSavePromptDecorator(decoratorData)
    setShowDecoratorSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowDecoratorSuccess(false)
    }, 3000)
  }

  const canSaveDecorator = (
    decoratorEnabled !== promptDecorator?.enabled ||
    decoratorText.trim() !== (promptDecorator?.text || '')
  )

  const handleClearDecorator = () => {
    setDecoratorEnabled(false)
    setDecoratorText('')
    onSavePromptDecorator({ enabled: false, text: '' })
    setShowDecoratorSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowDecoratorSuccess(false)
    }, 3000)
  }

  const hasDecoratorConfig = decoratorEnabled || decoratorText.trim()

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setLogoError('Only PNG and JPG images are allowed')
      return
    }

    // Read and save the image
    const reader = new FileReader()
    reader.onload = (event) => {
      // Save as base64
      setCustomLogo(event.target.result)
      setLogoError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setCustomLogo(null)
    setLogoError(null)
  }

  const handleCustomizeSubmit = (e) => {
    e.preventDefault()
    
    const customizationData = {
      logo: customLogo,
      title: customTitle.trim() || 'Conversation',
      colorScheme: customColorScheme.trim() || null
    }
    
    onSaveCustomization(customizationData)
    setShowCustomizeSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowCustomizeSuccess(false)
    }, 3000)
  }

  const canSaveCustomize = (
    customLogo !== customization?.logo ||
    customTitle.trim() !== (customization?.title || 'Conversation') ||
    (customColorScheme.trim() || null) !== (customization?.colorScheme || null)
  )

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Application configuration</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'broker' ? 'active' : ''}`}
          onClick={() => setActiveTab('broker')}
        >
          Broker URL
        </button>
        <button
          className={`tab-button ${activeTab === 'decorator' ? 'active' : ''}`}
          onClick={() => setActiveTab('decorator')}
        >
          Prompt Decorator
        </button>
        <button
          className={`tab-button ${activeTab === 'customize' ? 'active' : ''}`}
          onClick={() => setActiveTab('customize')}
        >
          Customize
        </button>
      </div>

      {/* Broker URL Tab */}
      {activeTab === 'broker' && (
        <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="label-with-history">
            <label htmlFor="broker-url" className="form-label">
              MuleSoft Agent Broker URL
            </label>
            {brokerUrlHistory && brokerUrlHistory.length > 0 && (
              <div className="history-buttons">
                <button
                  type="button"
                  className="history-toggle"
                  onClick={() => setShowHistory(!showHistory)}
                  title="Show URL history"
                >
                  <IoTimeOutline />
                  <span>History ({brokerUrlHistory.length})</span>
                </button>
                {brokerUrlHistory.length > 1 && (
                  <button
                    type="button"
                    className="clear-history-button-inline"
                    onClick={handleClearHistory}
                    title="Clear URL history"
                  >
                    <IoTrashOutline />
                  </button>
                )}
              </div>
            )}
          </div>

          {showHistory && brokerUrlHistory && brokerUrlHistory.length > 0 && (
            <div className="url-history">
              <p className="history-label">Recent Brokers:</p>
              {brokerUrlHistory.map((historyItem, index) => (
                <div
                  key={index}
                  className={`history-item ${historyItem.url === url ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="history-item-button"
                    onClick={() => handleSelectFromHistory(historyItem)}
                    title={`${historyItem.name || 'Unnamed'}: ${historyItem.url}`}
                  >
                    <div className="history-item-content">
                      {historyItem.name && <span className="history-name">{historyItem.name}</span>}
                      <span className="history-url">{historyItem.url}</span>
                    </div>
                    {historyItem.url === brokerConfig?.url && (
                      <span className="current-badge">Current</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="delete-history-item-button"
                    onClick={(e) => handleDeleteUrl(e, historyItem.url)}
                    title="Delete this URL from history"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="form-row">
            <div className="input-wrapper">
              <label htmlFor="broker-name" className="inline-label">Name</label>
              <input
                id="broker-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Broker name"
                className="form-input"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="broker-url" className="inline-label">URL</label>
              <input
                id="broker-url"
                type="text"
                value={url}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com/broker"
                className={`form-input ${!isValid && touched ? 'error' : ''} ${showSuccess ? 'success' : ''}`}
              />
              {!isValid && touched && (
                <div className="input-icon error-icon">
                  <IoAlertCircle />
                </div>
              )}
              {showSuccess && (
                <div className="input-icon success-icon">
                  <IoCheckmarkCircle />
                </div>
              )}
            </div>
          </div>
          
          {!isValid && touched && (
            <p className="error-message">
              Please enter a valid URL (must start with http:// or https://)
            </p>
          )}
          
          {showSuccess && (
            <p className="success-message">
              URL saved successfully
            </p>
          )}
          
          <p className="help-text">
            Enter the MuleSoft Agent Broker URL. This configuration will be saved in your browser.
          </p>
        </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={!canSave}
          >
            Save
          </button>
        </form>
      )}

      {/* Prompt Decorator Tab */}
      {activeTab === 'decorator' && (
        <form className="settings-form" onSubmit={handleDecoratorSubmit}>
          <div className="form-group">
            <div className="checkbox-wrapper">
              <input
                id="decorator-enabled"
                type="checkbox"
                checked={decoratorEnabled}
                onChange={(e) => setDecoratorEnabled(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="decorator-enabled" className="checkbox-label">
                Enable Prompt Decorator
              </label>
            </div>
            
            <p className="help-text">
              When enabled, the decorator text will be appended to every message sent to the broker.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="decorator-text" className="form-label">
              Decorator Text
            </label>
            
            <textarea
              id="decorator-text"
              value={decoratorText}
              onChange={(e) => setDecoratorText(e.target.value)}
              placeholder="Enter decorator text to append to messages..."
              className="form-textarea"
              rows="3"
              disabled={!decoratorEnabled}
            />
            
            {showDecoratorSuccess && (
              <p className="success-message">
                Prompt Decorator saved successfully
              </p>
            )}
            
            <p className="help-text">
              This text will be added at the end of your message with a period separator.
            </p>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="save-button"
              disabled={!canSaveDecorator}
            >
              Save
            </button>
            <button 
              type="button" 
              className="clear-button-decorator"
              onClick={handleClearDecorator}
              disabled={!hasDecoratorConfig}
            >
              Clear
            </button>
          </div>
        </form>
      )}

      {/* Customize Tab */}
      {activeTab === 'customize' && (
        <form className="settings-form" onSubmit={handleCustomizeSubmit}>
          {/* Logo Upload */}
          <div className="form-group">
            <label htmlFor="custom-logo" className="form-label">
              Custom Logo
            </label>
            
            <div className="logo-upload-container">
              {customLogo ? (
                <div className="logo-preview">
                  <img src={customLogo} alt="Custom Logo" className="logo-preview-image" />
                  <button 
                    type="button" 
                    className="remove-logo-button"
                    onClick={handleRemoveLogo}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="upload-area">
                  <input
                    id="custom-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleLogoUpload}
                    className="file-input"
                  />
                  <label htmlFor="custom-logo" className="file-label">
                    Click to upload logo
                  </label>
                </div>
              )}
            </div>
            
            {logoError && (
              <p className="error-message">{logoError}</p>
            )}
            
            <p className="help-text">
              Upload a custom logo (PNG or JPG). Any size is supported.
            </p>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="custom-title" className="form-label">
              Conversation Title
            </label>
            
            <input
              id="custom-title"
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Conversation"
              className="form-input"
            />
            
            <p className="help-text">
              Customize the title shown in the conversation header. Default: "Conversation"
            </p>
          </div>

          {/* Color Scheme */}
          <div className="form-group">
            <label htmlFor="custom-color" className="form-label">
              Color Scheme
            </label>
            
            <div className="color-picker-container">
              <input
                id="custom-color"
                type="color"
                value={customColorScheme || '#0073e6'}
                onChange={(e) => setCustomColorScheme(e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={customColorScheme || '#0073e6'}
                onChange={(e) => setCustomColorScheme(e.target.value)}
                placeholder="#0073e6"
                className="color-input"
              />
            </div>

            {/* Color Scheme Preview */}
            {customColorScheme && (() => {
              const scheme = generateColorScheme(customColorScheme)
              return scheme ? (
                <div className="color-scheme-preview">
                  <p className="preview-label">Color Scheme Preview:</p>
                  <div className="color-palette">
                    <div className="palette-row">
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.accentColor }}></div>
                        <span className="palette-name">Accent</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.primaryColor }}></div>
                        <span className="palette-name">Primary</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.secondaryColor }}></div>
                        <span className="palette-name">Secondary</span>
                      </div>
                    </div>
                    <div className="palette-row">
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.bgPrimary }}></div>
                        <span className="palette-name">BG Primary</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.bgSecondary }}></div>
                        <span className="palette-name">BG Secondary</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.bgTertiary }}></div>
                        <span className="palette-name">BG Tertiary</span>
                      </div>
                    </div>
                    <div className="palette-row">
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.messageOwn }}></div>
                        <span className="palette-name">Your Messages</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.messageOther }}></div>
                        <span className="palette-name">Bot Messages</span>
                      </div>
                      <div className="palette-item">
                        <div className="palette-swatch" style={{ backgroundColor: scheme.borderColor }}></div>
                        <span className="palette-name">Borders</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            })()}
            
            {showCustomizeSuccess && (
              <p className="success-message">
                Customization saved successfully
              </p>
            )}
            
            <p className="help-text">
              Select a custom accent color for the application. This will generate a complete color scheme for backgrounds, borders, and messages.
            </p>
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={!canSaveCustomize}
          >
            Save
          </button>
        </form>
      )}

      {/* Current Configuration */}
      {activeTab === 'broker' && brokerConfig?.url && (
        <div className="current-config">
          <h3>Current Configuration</h3>
          <div className="config-row">
            {brokerConfig.name && (
              <div className="config-item config-item-name">
                <span className="config-label">Broker Name:</span>
                <span className="config-value">{brokerConfig.name}</span>
              </div>
            )}
            <div className="config-item config-item-url">
              <span className="config-label">Broker URL:</span>
              <span className="config-value">{brokerConfig.url}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'decorator' && promptDecorator && (
        <div className="current-config">
          <h3>Current Configuration</h3>
          <div className="config-item">
            <span className="config-label">Status:</span>
            <span className="config-value">{promptDecorator.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          {promptDecorator.text && (
            <div className="config-item">
              <span className="config-label">Decorator Text:</span>
              <span className="config-value">{promptDecorator.text}</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'customize' && customization && (
        <div className="current-config">
          <h3>Current Configuration</h3>
          {customization.logo && (
            <div className="config-item">
              <span className="config-label">Logo:</span>
              <img src={customization.logo} alt="Current Logo" className="config-logo-preview" />
            </div>
          )}
          <div className="config-item">
            <span className="config-label">Title:</span>
            <span className="config-value">{customization.title || 'Conversation'}</span>
          </div>
          {customization.colorScheme && (
            <div className="config-item">
              <span className="config-label">Color Scheme:</span>
              <div className="color-display">
                <span 
                  className="color-swatch" 
                  style={{ backgroundColor: customization.colorScheme }}
                ></span>
                <span className="config-value">{customization.colorScheme}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Settings

