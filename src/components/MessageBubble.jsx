import ReactMarkdown from 'react-markdown'
import './MessageBubble.css'

function MessageBubble({ message }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`message-bubble ${message.isOwn ? 'own' : 'other'} ${message.hasError ? 'error' : ''}`}>
      <div className="bubble-content">
        <div className="message-text">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}

export default MessageBubble

