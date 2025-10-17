import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ConversationView from './components/ConversationView'
import Settings from './components/Settings'
import Information from './components/Information'
import ErrorModal from './components/ErrorModal'
import { getCookie, setCookie } from './utils/cookies'
import { createBrokerMessage, extractBrokerResponseText } from './utils/helpers'
import './App.css'

const BROKER_URL_COOKIE_NAME = 'mulesoft_broker_url'
const PROMPT_DECORATOR_COOKIE_NAME = 'mulesoft_prompt_decorator'

function App() {
  const [currentView, setCurrentView] = useState('conversations')
  const [messages, setMessages] = useState([])
  const [brokerUrl, setBrokerUrl] = useState('')
  const [promptDecorator, setPromptDecorator] = useState({ enabled: false, text: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  // Cargar la URL del broker desde la cookie al iniciar la aplicación
  useEffect(() => {
    const savedUrl = getCookie(BROKER_URL_COOKIE_NAME)
    if (savedUrl) {
      setBrokerUrl(savedUrl)
    }
  }, [])

  // Load prompt decorator from cookie on app start
  useEffect(() => {
    const savedDecorator = getCookie(PROMPT_DECORATOR_COOKIE_NAME)
    if (savedDecorator) {
      try {
        const parsed = JSON.parse(savedDecorator)
        setPromptDecorator(parsed)
      } catch (e) {
        console.error('Error parsing prompt decorator cookie:', e)
      }
    }
  }, [])

  const handleSendMessage = async (text) => {
    // Check if broker URL is configured
    if (!brokerUrl) {
      setError({
        message: 'Broker URL not configured',
        details: 'Please configure the MuleSoft Agent Broker URL in Settings before sending messages.'
      })
      setIsErrorModalOpen(true)
      return
    }

    // Apply prompt decorator if enabled
    let messageText = text
    if (promptDecorator.enabled && promptDecorator.text.trim()) {
      messageText = `${text}. ${promptDecorator.text.trim()}`
    }

    // Create JSON-RPC payload with decorated text
    const payload = createBrokerMessage(messageText)

    // Add user message to canvas (right side) - showing original text without decorator
    const userMessage = {
      id: Date.now(),
      text,
      timestamp: new Date(),
      isOwn: true,
      hasError: false,
      debugJson: {
        type: 'REQUEST',
        url: brokerUrl,
        payload: payload
      }
    }
    setMessages(prev => [...prev, userMessage])

    // Start loading
    setIsLoading(true)

    try {
      // Make POST request to broker
      const response = await fetch(brokerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      // Check if response is 200 OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw {
          status: response.status,
          statusText: response.statusText,
          message: `Server error: ${response.status} ${response.statusText}`,
          responseData: errorData
        }
      }

      // Process response
      const responseData = await response.json()
      
      // Extract text from response
      const responseText = extractBrokerResponseText(responseData)
      
      // Check if response is empty
      if (responseText === '') {
        // Show generic message for empty response instead of error modal
        const emptyMessage = {
          id: Date.now() + 1,
          text: 'Empty response received. Please, try again',
          timestamp: new Date(),
          isOwn: false,
          debugJson: {
            type: 'RESPONSE',
            status: response.status,
            statusText: response.statusText,
            payload: responseData
          }
        }
        setMessages(prev => [...prev, emptyMessage])
      } else if (!responseText) {
        // Only throw error if responseText is null/undefined (invalid format)
        throw {
          message: 'Invalid broker response',
          details: 'The broker response does not contain the expected format.',
          responseData
        }
      } else {
        // Add bot message to canvas (left side)
        const botMessage = {
          id: Date.now() + 1,
          text: responseText,
          timestamp: new Date(),
          isOwn: false,
          debugJson: {
            type: 'RESPONSE',
            status: response.status,
            statusText: response.statusText,
            payload: responseData
          }
        }
        setMessages(prev => [...prev, botMessage])
      }

    } catch (err) {
      console.error('Error sending message to broker:', err)
      
      // Mark the last user message as failed (change background to red)
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.isOwn) {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, hasError: true }
          ]
        }
        return prev
      })
      
      // Check if it's a CORS error
      const isCorsError = err instanceof TypeError && 
                         (err.message.includes('Failed to fetch') || 
                          err.message.includes('NetworkError') ||
                          err.message.includes('CORS'))
      
      // Prepare error to show in modal
      const errorToShow = isCorsError ? {
        message: 'Unable to invoke the Broker URL due to a CORS error. Please fix it and try again.',
        details: 'Tip: Add the CORS APIM policy to the Broker inbound endpoint',
        isCorsError: true
      } : {
        message: err.message || 'Error communicating with broker',
        status: err.status,
        statusText: err.statusText,
        responseData: err.responseData
      }
      
      setError(errorToShow)
      setIsErrorModalOpen(true)
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBrokerUrl = (url) => {
    setBrokerUrl(url)
    setCookie(BROKER_URL_COOKIE_NAME, url, 365) // Save for 1 year
  }

  const handleSavePromptDecorator = (decorator) => {
    setPromptDecorator(decorator)
    setCookie(PROMPT_DECORATOR_COOKIE_NAME, JSON.stringify(decorator), 365) // Save for 1 year
  }

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false)
    setError(null)
  }

  const handleClearMessages = () => {
    setMessages([])
  }

  return (
    <div className="app">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="main-content">
        {currentView === 'conversations' ? (
          <ConversationView 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onClearMessages={handleClearMessages}
            isLoading={isLoading}
            isDisabled={isLoading}
            brokerUrl={brokerUrl}
          />
        ) : currentView === 'information' ? (
          <Information />
        ) : (
          <Settings 
            brokerUrl={brokerUrl} 
            onSaveBrokerUrl={handleSaveBrokerUrl}
            promptDecorator={promptDecorator}
            onSavePromptDecorator={handleSavePromptDecorator}
          />
        )}
      </div>
      <ErrorModal 
        isOpen={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        error={error}
      />
    </div>
  )
}

export default App

