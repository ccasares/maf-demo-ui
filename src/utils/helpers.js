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
 * @param {string|null} sessionId - ID de sesión de la aplicación
 * @param {string|null} taskId - ID de tarea opcional
 * @param {string} brokerVersion - Versión del broker (V1 o V2)
 * @returns {object} Estructura JSON-RPC
 */
export const createBrokerMessage = (text, conversationId = null, sessionId = null, taskId = null, brokerVersion = 'V1') => {
  const isV2 = brokerVersion === 'V2'
  
  // Create parts array with or without "kind" based on version
  const parts = [
    {
      text: text,
      ...(isV2 ? {} : { kind: "text" })
    }
  ]
  
  // Create message object with or without "kind" based on version
  const message = {
    role: isV2 ? "ROLE_USER" : "user",
    parts: parts,
    messageId: generateUUID(),
    ...(isV2 ? {} : { kind: "message" })
  }
  
  // Add contextId to message if provided (both V1 and V2)
  if (conversationId) {
    message.contextId = conversationId
  }
  
  // Add taskId to message if provided (V1 only)
  if (!isV2 && taskId) {
    message.taskId = taskId
  }
  
  const payload = {
    jsonrpc: "2.0",
    id: isV2 ? generateUUID() : generateRandomId(),
    method: isV2 ? "SendMessage" : "message/send",
    params: {
      message: message,
      metadata: {}
    }
  }
  
  // Add sessionId to metadata if provided (V1 only)
  if (!isV2 && sessionId) {
    payload.params.metadata.sessionId = sessionId
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
    // Try V2 format first: result.task.status.message.parts[0].text
    if (response.result &&
        response.result.task &&
        response.result.task.status &&
        response.result.task.status.message &&
        response.result.task.status.message.parts &&
        response.result.task.status.message.parts.length > 0 &&
        response.result.task.status.message.parts[0].text !== undefined) {
      return response.result.task.status.message.parts[0].text
    }
    
    // Try V1 format: result.artifacts[0].parts[0].text
    if (response.result && 
        response.result.artifacts && 
        response.result.artifacts.length > 0 &&
        response.result.artifacts[0].parts &&
        response.result.artifacts[0].parts.length > 0 &&
        response.result.artifacts[0].parts[0].text !== undefined) {
      return response.result.artifacts[0].parts[0].text
    }
    
    // Try V1 format: result.status.message.parts[0].text
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

/**
 * Extraer el estado de la conversación del broker
 * @param {object} response - Respuesta del broker
 * @returns {string|null} Estado normalizado o null si no existe
 */
export const extractConversationState = (response) => {
  try {
    // Try V2 format: result.task.status.state
    if (response.result && response.result.task && response.result.task.status && response.result.task.status.state) {
      const state = response.result.task.status.state
      // Map V2 states to V1 equivalents for consistent handling
      if (state === 'TASK_STATE_INPUT_REQUIRED') return 'input-required'
      if (state === 'TASK_STATE_COMPLETED') return 'completed'
      return state
    }
    
    // Try V1 format: result.status.state
    if (response.result && response.result.status && response.result.status.state) {
      return response.result.status.state
    }
    
    return null
  } catch (error) {
    console.error('Error extrayendo estado de conversación:', error)
    return null
  }
}

/**
 * Extraer el contextId de la respuesta del broker
 * @param {object} response - Respuesta del broker
 * @returns {string|null} contextId o null si no existe
 */
export const extractContextId = (response) => {
  try {
    // Try V2 format: result.task.contextId
    if (response.result && response.result.task && response.result.task.contextId) {
      return response.result.task.contextId
    }
    
    // Try V1 format: result.contextId
    if (response.result && response.result.contextId) {
      return response.result.contextId
    }
    
    return null
  } catch (error) {
    console.error('Error extrayendo contextId:', error)
    return null
  }
}

/**
 * Extraer el taskId de la respuesta del broker
 * @param {object} response - Respuesta del broker
 * @returns {string|null} taskId o null si no existe
 */
export const extractTaskId = (response) => {
  try {
    // Try V2 format: result.task.id
    if (response.result && response.result.task && response.result.task.id) {
      return response.result.task.id
    }
    
    // Try V1 format: result.status.taskId
    if (response.result && response.result.status && response.result.status.taskId) {
      return response.result.status.taskId
    }
    
    return null
  } catch (error) {
    console.error('Error extrayendo taskId:', error)
    return null
  }
}


