import { useState } from 'react'
import { IoChatbubbleEllipsesOutline, IoSettingsOutline, IoInformationCircleOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import './Sidebar.css'

function Sidebar({ currentView, onViewChange }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/mulesoft_logo.png" alt="MuleSoft Logo" className="sidebar-logo" />
        {!isCollapsed && <h1>MuleSoft Agent Fabric</h1>}
      </div>
          <nav className="sidebar-menu">
            <button
              className={`menu-item ${currentView === 'conversations' ? 'active' : ''}`}
              onClick={() => onViewChange('conversations')}
              title="Conversations"
            >
              <IoChatbubbleEllipsesOutline className="menu-icon" />
              {!isCollapsed && <span>Conversations</span>}
            </button>
            <button
              className={`menu-item ${currentView === 'information' ? 'active' : ''}`}
              onClick={() => onViewChange('information')}
              title="Information"
            >
              <IoInformationCircleOutline className="menu-icon" />
              {!isCollapsed && <span>Information</span>}
            </button>
            <button
              className={`menu-item ${currentView === 'settings' ? 'active' : ''}`}
              onClick={() => onViewChange('settings')}
              title="Settings"
            >
              <IoSettingsOutline className="menu-icon" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </nav>
      <div className="sidebar-footer">
        <button className="collapse-button" onClick={toggleSidebar} title={isCollapsed ? "Expand" : "Collapse"}>
          {isCollapsed ? <IoChevronForward /> : <IoChevronBack />}
        </button>
      </div>
    </div>
  )
}

export default Sidebar

