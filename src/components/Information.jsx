import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ImageModal from './ImageModal'
import './Information.css'

function Information() {
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', alt: '' })

  const handleImageClick = (src, alt) => {
    setImageModal({ isOpen: true, src, alt })
  }

  const handleCloseModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' })
  }

  const markdownContent = `## MuleSoft Agent Fabric

MuleSoft Agent Fabric is an agent management platform that maximizes the potential of every AI agent, no matter where it's built, with centralized discovery, orchestration across agents and tools, cross-ecosystem governance, and full transparency into agentic interactions.

## MuleSoft Agent Network

An agent network consists of brokers, agents, and MCP servers in the same domain. You define an agent network in a YAML template in your agent network project. The MuleSoft Dev Agent can help create and configure your YAML for you.

## MuleSoft Agent Broker

MuleSoft Agent Broker is an intelligent routing agent that coordinates task delegation across specialized agents in your enterprise. It's defined by the agents and MCP servers it leverages to accomplish tasks.

### For more info go to [MuleSoft Agent Fabric Documentation](https://docs.mulesoft.com/agent-fabric/)`

  return (
    <div className="information-view">
      <div className="information-header">
        <h2>Information</h2>
      </div>
      <div className="information-content">
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              )
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>

        <div className="image-section">
          <h3 className="image-title">Agent Broker Example</h3>
          <div className="image-container">
            <img
              src="/agent_network.png"
              alt="Agent Broker Example"
              className="info-image"
              onClick={() => handleImageClick('/agent_network.png', 'Agent Broker Example')}
              title="Click to zoom"
            />
          </div>
        </div>

        <div className="image-section">
          <h3 className="image-title">Agent Visualizer Example</h3>
          <div className="image-container">
            <img
              src="/agent_visualizer.png"
              alt="Agent Visualizer Example"
              className="info-image"
              onClick={() => handleImageClick('/agent_visualizer.png', 'Agent Visualizer Example')}
              title="Click to zoom"
            />
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={handleCloseModal}
        imageSrc={imageModal.src}
        imageAlt={imageModal.alt}
      />
    </div>
  )
}

export default Information

