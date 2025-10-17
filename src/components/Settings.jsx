import { useState, useEffect } from 'react'
import { IoCheckmarkCircle, IoAlertCircle, IoTimeOutline } from 'react-icons/io5'
import { isValidURL } from '../utils/cookies'
import './Settings.css'

function Settings({ brokerUrl, brokerUrlHistory, onSaveBrokerUrl, promptDecorator, onSavePromptDecorator }) {
  const [activeTab, setActiveTab] = useState('broker')
  const [url, setUrl] = useState(brokerUrl || '')
  const [isValid, setIsValid] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [touched, setTouched] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  // Prompt Decorator state
  const [decoratorEnabled, setDecoratorEnabled] = useState(promptDecorator?.enabled || false)
  const [decoratorText, setDecoratorText] = useState(promptDecorator?.text || '')
  const [showDecoratorSuccess, setShowDecoratorSuccess] = useState(false)

  useEffect(() => {
    setUrl(brokerUrl || '')
  }, [brokerUrl])

  useEffect(() => {
    setDecoratorEnabled(promptDecorator?.enabled || false)
    setDecoratorText(promptDecorator?.text || '')
  }, [promptDecorator])

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
      onSaveBrokerUrl(url.trim())
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }

  const canSave = url.trim() && isValid && url !== brokerUrl

  const handleSelectFromHistory = (selectedUrl) => {
    setUrl(selectedUrl)
    setShowHistory(false)
    setIsValid(true)
    setTouched(true)
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
              <button
                type="button"
                className="history-toggle"
                onClick={() => setShowHistory(!showHistory)}
                title="Show URL history"
              >
                <IoTimeOutline />
                <span>History ({brokerUrlHistory.length})</span>
              </button>
            )}
          </div>

          {showHistory && brokerUrlHistory && brokerUrlHistory.length > 0 && (
            <div className="url-history">
              <p className="history-label">Recent URLs:</p>
              {brokerUrlHistory.map((historyUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`history-item ${historyUrl === url ? 'active' : ''}`}
                  onClick={() => handleSelectFromHistory(historyUrl)}
                  title={historyUrl}
                >
                  <span className="history-url">{historyUrl}</span>
                  {historyUrl === brokerUrl && (
                    <span className="current-badge">Current</span>
                  )}
                </button>
              ))}
            </div>
          )}
          
          <div className="input-wrapper">
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

      {/* Current Configuration */}
      {activeTab === 'broker' && brokerUrl && (
        <div className="current-config">
          <h3>Current Configuration</h3>
          <div className="config-item">
            <span className="config-label">Broker URL:</span>
            <span className="config-value">{brokerUrl}</span>
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
    </div>
  )
}

export default Settings

