import { useState } from 'react'
import { IoSend } from 'react-icons/io5'
import './MessageInput.css'

function MessageInput({ onSendMessage, disabled = false, brokerUrl }) {
  const [text, setText] = useState('')

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

  const isBrokerConfigured = brokerUrl && brokerUrl.trim() !== ''
  
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
    <form className="message-input" onSubmit={handleSubmit}>
      <input
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
  )
}

export default MessageInput

