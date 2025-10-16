import { IoCloseCircle, IoClose } from 'react-icons/io5'
import './ErrorModal.css'

function ErrorModal({ isOpen, onClose, error }) {
  if (!isOpen) return null

  const getErrorMessage = () => {
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'An error occurred while processing your request'
  }

  const getErrorDetails = () => {
    // For custom details (like CORS tip)
    if (error?.details) {
      return error.details
    }
    
    if (error?.status) {
      return `Status code: ${error.status}`
    }
    
    if (error?.statusText) {
      return error.statusText
    }
    
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <IoCloseCircle />
          </div>
          <h2>Error</h2>
          <button className="modal-close-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="error-message-text">{getErrorMessage()}</p>
          {getErrorDetails() && (
            <p className="error-details">{getErrorDetails()}</p>
          )}
          {error?.responseData && (
            <details className="error-response-details">
              <summary>Technical details</summary>
              <pre>{JSON.stringify(error.responseData, null, 2)}</pre>
            </details>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal

