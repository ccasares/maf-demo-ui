import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { IoBugOutline, IoClose, IoAlertCircleOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoRefreshOutline, IoCopyOutline, IoArrowRedoOutline } from 'react-icons/io5'
import './MessageBubble.css'

function MessageBubble({ message, onRetry }) {
  const [showDebugModal, setShowDebugModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const formatJsonWithColors = (json) => {
    const jsonString = JSON.stringify(json, null, 2)
    const escaped = jsonString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?=:))|("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?/g,
      (match, key, _keyEsc, str, _strEsc, boolOrNull) => {
        if (key) return `<span class="json-key">${match}</span>`
        if (str) return `<span class="json-string">${match}</span>`
        if (boolOrNull) return `<span class="json-boolean">${match}</span>`
        return `<span class="json-number">${match}</span>`
      }
    )
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleDebugClick = (e) => {
    e.stopPropagation()
    setShowDebugModal(true)
  }

  const handleCloseModal = () => {
    setShowDebugModal(false)
  }

  const handleCopyDebugJson = async () => {
    try {
      const jsonText = JSON.stringify(message.debugJson, null, 2)
      await navigator.clipboard.writeText(jsonText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    } catch (error) {
      console.error('Failed to copy debug JSON:', error)
    }
  }

  const handleRetryClick = (e) => {
    e.stopPropagation()
    if (onRetry && message.retryMessage) {
      onRetry(message.retryMessage)
    }
  }

  const handleResendClick = (e) => {
    e.stopPropagation()
    if (onRetry && message.text) {
      onRetry(message.text)
    }
  }

  return (
    <>
      <div className={`message-bubble ${message.isOwn ? 'own' : 'other'} ${message.hasError ? 'error' : ''}`}>
        {message.isOwn && (
          <button 
            className="resend-button"
            onClick={handleResendClick}
            title="Resend message"
          >
            <IoArrowRedoOutline className="resend-icon" />
          </button>
        )}
        
        <div className="bubble-content">
          <div className="message-text">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
          <div className="message-footer">
            {message.debugJson && (
              <button 
                className="debug-button" 
                onClick={handleDebugClick}
                title="Show debug info"
              >
                <IoBugOutline />
              </button>
            )}
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
        
        {!message.isOwn && message.conversationState && (
          <div className="conversation-state-indicator">
            {(message.conversationState === 'input-required' || message.conversationState === 'input_required') && (
              <div className="state-icon-wrapper" data-tooltip="Input required">
                <IoAlertCircleOutline 
                  className="state-icon input-required-icon"
                />
              </div>
            )}
            {message.conversationState === 'completed' && (
              <div className="state-icon-wrapper" data-tooltip="Task completed">
                <IoCheckmarkCircleOutline 
                  className="state-icon completed-icon"
                />
              </div>
            )}
            {message.conversationState === 'failed' && (
              <>
                <div className="state-icon-wrapper" data-tooltip="Failed">
                  <IoCloseCircleOutline 
                    className="state-icon failed-icon"
                  />
                </div>
                <button 
                  className="retry-button"
                  onClick={handleRetryClick}
                  title="Retry message"
                >
                  <IoRefreshOutline className="retry-icon" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Debug Modal */}
      {showDebugModal && message.debugJson && (
        <div className="debug-modal-overlay" onClick={handleCloseModal}>
          <div className="debug-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="debug-modal-header">
              <h3>Debug Information</h3>
              <div className="debug-modal-actions">
                <button
                  className="debug-modal-copy"
                  onClick={handleCopyDebugJson}
                  title={isCopied ? 'Copied' : 'Copy JSON'}
                  aria-label="Copy JSON"
                >
                  <IoCopyOutline />
                </button>
                {isCopied && <span className="debug-modal-copied">Copied!</span>}
                <button className="debug-modal-close" onClick={handleCloseModal}>
                  <IoClose />
                </button>
              </div>
            </div>
            <div className="debug-modal-body">
              <pre
                className="debug-json json-beautify"
                dangerouslySetInnerHTML={{
                  __html: formatJsonWithColors(message.debugJson)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessageBubble

