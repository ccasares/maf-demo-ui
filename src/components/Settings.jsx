import { useState, useEffect } from 'react'
import { IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5'
import { isValidURL } from '../utils/cookies'
import './Settings.css'

function Settings({ brokerUrl, onSaveBrokerUrl }) {
  const [url, setUrl] = useState(brokerUrl || '')
  const [isValid, setIsValid] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    setUrl(brokerUrl || '')
  }, [brokerUrl])

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

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Application configuration</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="broker-url" className="form-label">
            MuleSoft Agent Broker URL
          </label>
          
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

      {brokerUrl && (
        <div className="current-config">
          <h3>Current Configuration</h3>
          <div className="config-item">
            <span className="config-label">Broker URL:</span>
            <span className="config-value">{brokerUrl}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings

