import './LoadingIndicator.css'

function LoadingIndicator({ text = 'Waiting for response...' }) {
  return (
    <div className="loading-indicator">
      <div className="loading-dots">
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
      </div>
      <span className="loading-text">{text}</span>
    </div>
  )
}

export default LoadingIndicator

