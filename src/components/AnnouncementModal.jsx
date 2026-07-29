import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import './AnnouncementModal.css'

function AnnouncementModal({ isOpen, onClose, onDontShowAgain }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      onDontShowAgain()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="announcement-modal-overlay" onClick={handleClose}>
      <div className="announcement-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="announcement-modal-close" onClick={handleClose}>
          <IoClose />
        </button>
        
        <div className="announcement-modal-header">
          <h2>NEW</h2>
        </div>
        
        <div className="announcement-modal-body">
          <p>
            Support for Agent Broker V2 has been introduced in non-stream mode. 
            Async mode will be supported soon
          </p>
        </div>
        
        <div className="announcement-modal-footer">
          <div className="announcement-checkbox-wrapper">
            <input
              id="dont-show-again"
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="announcement-checkbox"
            />
            <label htmlFor="dont-show-again" className="announcement-checkbox-label">
              Don't show again
            </label>
          </div>
          
          <button className="announcement-button" onClick={handleClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal
