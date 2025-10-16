import { IoClose } from 'react-icons/io5'
import './ImageModal.css'

function ImageModal({ isOpen, onClose, imageSrc, imageAlt }) {
  if (!isOpen) return null

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>
          <IoClose />
        </button>
        <img src={imageSrc} alt={imageAlt} className="image-modal-img" />
      </div>
    </div>
  )
}

export default ImageModal

