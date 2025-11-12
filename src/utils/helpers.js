/**
 * Utilidades generales
 */

/**
 * Generar un UUID v4
 * @returns {string} UUID generado
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Generar un ID numérico aleatorio
 * @returns {number} ID generado
 */
export const generateRandomId = () => {
  return Math.floor(Math.random() * 100000000)
}

/**
 * Crear la estructura JSON-RPC para enviar mensaje al broker
 * @param {string} text - Texto del mensaje
 * @param {string|null} conversationId - ID de conversación opcional
 * @returns {object} Estructura JSON-RPC
 */
export const createBrokerMessage = (text, conversationId = null) => {
  const payload = {
    jsonrpc: "2.0",
    id: generateRandomId(),
    method: "message/send",
    params: {
      message: {
        role: "user",
        kind: "message",
        parts: [
          {
            kind: "text",
            text: text
          }
        ],
        messageId: generateUUID()
      },
      metadata: {}
    }
  }
  
  // Add conversation_id if provided
  if (conversationId) {
    payload.params.conversation_id = conversationId
  }
  
  return payload
}

/**
 * Extraer el texto de respuesta del broker
 * @param {object} response - Respuesta del broker
 * @returns {string|null} Texto extraído o null si no existe
 */
export const extractBrokerResponseText = (response) => {
  try {
    // Try to extract from result.artifacts[0].parts[0].text
    if (response.result && 
        response.result.artifacts && 
        response.result.artifacts.length > 0 &&
        response.result.artifacts[0].parts &&
        response.result.artifacts[0].parts.length > 0 &&
        response.result.artifacts[0].parts[0].text !== undefined) {
      return response.result.artifacts[0].parts[0].text
    }
    
    // Try to extract from result.status.message.parts[0].text
    if (response.result &&
        response.result.status &&
        response.result.status.message &&
        response.result.status.message.parts &&
        response.result.status.message.parts.length > 0 &&
        response.result.status.message.parts[0].text !== undefined) {
      return response.result.status.message.parts[0].text
    }
    
    return null
  } catch (error) {
    console.error('Error extrayendo texto de respuesta:', error)
    return null
  }
}

