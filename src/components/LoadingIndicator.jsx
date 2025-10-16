import './LoadingIndicator.css'

function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <div className="loading-dots">
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
        <span className="loading-dot"></span>
      </div>
      <span className="loading-text">Waiting for response...</span>
    </div>
  )
}

export default LoadingIndicator

