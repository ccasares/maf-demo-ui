import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import LoadingIndicator from './LoadingIndicator'
import './ConversationView.css'

const ConversationView = forwardRef(({ messages, onSendMessage, onClearMessages, isLoading, isDisabled, brokerUrl }, ref) => {
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      messageInputRef.current?.focus()
    }
  }))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const isBrokerConfigured = brokerUrl && brokerUrl.trim() !== ''

  return (
    <div className="conversation-view">
      <div className="conversation-header">
        <h2>Conversation</h2>
        <button 
          className="clear-button" 
          onClick={onClearMessages}
          disabled={messages.length === 0}
          title="Clear conversation"
        >
          <IoTrashOutline />
        </button>
      </div>
      <div className="messages-container">
        {!isBrokerConfigured && messages.length === 0 ? (
          <div className="empty-state">
            <div className="config-warning">
              <p className="warning-title">⚠️ Broker URL Not Configured</p>
              <p className="warning-message">
                Please configure the MuleSoft Agent Broker URL in Settings before sending messages.
              </p>
              <p className="warning-hint">
                Click on Settings in the sidebar to get started.
              </p>
            </div>
          </div>
        ) : messages.length === 0 && !isLoading ? (
          <div className="empty-state">
            <p>No messages yet. Write something to start!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onRetry={onSendMessage}
              />
            ))}
            {isLoading && <LoadingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput 
        ref={messageInputRef}
        onSendMessage={onSendMessage} 
        disabled={isDisabled || !isBrokerConfigured}
        brokerUrl={brokerUrl}
      />
    </div>
  )
})

ConversationView.displayName = 'ConversationView'

export default ConversationView

