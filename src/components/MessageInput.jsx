import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { IoSend } from 'react-icons/io5'
import './MessageInput.css'

const MessageInput = forwardRef(({ onSendMessage, disabled = false, brokerConfig }, ref) => {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    }
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !disabled) {
      onSendMessage(text.trim())
      setText('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const isBrokerConfigured = brokerConfig?.url && brokerConfig.url.trim() !== ''
  
  const getPlaceholder = () => {
    if (!isBrokerConfigured) {
      return "Configure Broker URL in Settings first..."
    }
    if (disabled) {
      return "Waiting for response..."
    }
    return "Write a message..."
  }

  return (
    <div className="message-input-container">
      {isBrokerConfigured && brokerConfig.name && (
        <div className="broker-indicator">
          Current broker: <strong>{brokerConfig.name}</strong>
        </div>
      )}
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          className="input-field"
          disabled={disabled}
        />
        <button type="submit" className="send-button" disabled={!text.trim() || disabled}>
          <IoSend />
        </button>
      </form>
    </div>
  )
})

MessageInput.displayName = 'MessageInput'

export default MessageInput

