import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { IoBugOutline, IoClose, IoAlertCircleOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoRefreshOutline } from 'react-icons/io5'
import './MessageBubble.css'

function MessageBubble({ message, onRetry }) {
  const [showDebugModal, setShowDebugModal] = useState(false)

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

  const handleRetryClick = (e) => {
    e.stopPropagation()
    if (onRetry && message.retryMessage) {
      onRetry(message.retryMessage)
    }
  }

  return (
    <>
      <div className={`message-bubble ${message.isOwn ? 'own' : 'other'} ${message.hasError ? 'error' : ''}`}>
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
            {message.conversationState === 'input-required' && (
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
              <button className="debug-modal-close" onClick={handleCloseModal}>
                <IoClose />
              </button>
            </div>
            <div className="debug-modal-body">
              <pre className="debug-json">
                {JSON.stringify(message.debugJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessageBubble

