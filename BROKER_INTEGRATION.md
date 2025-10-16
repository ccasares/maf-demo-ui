# 🔗 Integración con MuleSoft Agent Broker

## Descripción General

La aplicación está completamente integrada con el MuleSoft Agent Broker mediante comunicación JSON-RPC 2.0. Los mensajes enviados por el usuario se transmiten al broker y las respuestas se muestran en tiempo real en la interfaz conversacional.

---

## 🚀 Flujo de Comunicación

### 1. Envío de Mensaje

Cuando el usuario escribe un mensaje y lo envía:

```mermaid
Usuario → Input → App.jsx → POST (JSON-RPC) → Broker
```

**Request Payload:**
```json
{
  "jsonrpc": "2.0",
  "id": 12312414,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "kind": "message",
      "parts": [
        {
          "kind": "text",
          "text": "Check inventory for MULETEST0 and get data for account Homeland"
        }
      ],
      "messageId": "9229e770-767c-417b-a0b0-f0741243c589"
    },
    "metadata": {}
  }
}
```

### 2. Recepción de Respuesta

El broker responde con:

```mermaid
Broker → Response (HTTP 200) → App.jsx → Canvas (izquierda)
```

**Response Payload:**
```json
{
    "id": 12312414,
    "jsonrpc": "2.0",
    "result": {
        "artifacts": [
            {
                "artifactId": "cc020825-10d5-4368-982c-ef3eb22fb68e",
                "parts": [
                    {
                        "kind": "text",
                        "text": "Inventory for material MULETEST0: 1,650,478 units..."
                    }
                ]
            }
        ],
        "contextId": "99ba5a75-d0c4-444c-82c0-1c9ff7592594",
        "id": "15470b3e-4f84-4fb3-8297-76fa18ed545a",
        "kind": "task",
        "status": {
            "state": "completed",
            "timestamp": "2025-10-15T14:42:17.420417617Z"
        },
        "url": "https://..."
    }
}
```

### 3. Extracción y Visualización

```javascript
// Se extrae: result.artifacts[0].parts[0].text
// Se muestra en el canvas como mensaje del bot (izquierda)
```

---

## 📋 Componentes Implementados

### 1. **Utilidades (src/utils/helpers.js)**

#### `generateUUID()`
Genera un UUID v4 único para cada mensaje.

```javascript
import { generateUUID } from './utils/helpers'
const messageId = generateUUID()
// "9229e770-767c-417b-a0b0-f0741243c589"
```

#### `generateRandomId()`
Genera un ID numérico aleatorio para cada petición JSON-RPC.

```javascript
import { generateRandomId } from './utils/helpers'
const requestId = generateRandomId()
// 12312414
```

#### `createBrokerMessage(text)`
Crea la estructura JSON-RPC completa lista para enviar.

```javascript
import { createBrokerMessage } from './utils/helpers'
const payload = createBrokerMessage("Hello broker")
// Retorna objeto JSON-RPC completo
```

#### `extractBrokerResponseText(response)`
Extrae el texto de respuesta desde la estructura JSON del broker.

```javascript
import { extractBrokerResponseText } from './utils/helpers'
const text = extractBrokerResponseText(responseData)
// "Inventory for material MULETEST0: 1,650,478 units..."
```

### 2. **Modal de Error (src/components/ErrorModal.jsx)**

Componente modal para mostrar errores cuando:
- La petición falla (status ≠ 200)
- No hay URL de broker configurada
- El formato de respuesta es inválido
- Hay errores de red

**Props:**
- `isOpen` (boolean): Controla visibilidad del modal
- `onClose` (function): Callback al cerrar el modal
- `error` (object): Objeto con información del error

**Ejemplo de uso:**
```jsx
<ErrorModal 
  isOpen={isErrorModalOpen}
  onClose={() => setIsErrorModalOpen(false)}
  error={{
    message: "Error del servidor: 500 Internal Server Error",
    status: 500,
    statusText: "Internal Server Error",
    responseData: {...}
  }}
/>
```

### 3. **Indicador de Loading (src/components/LoadingIndicator.jsx)**

Muestra animación de "tres puntos" mientras se espera respuesta del broker.

```jsx
{isLoading && <LoadingIndicator />}
```

### 4. **Integración en App.jsx**

La lógica principal está en `handleSendMessage`:

```javascript
const handleSendMessage = async (text) => {
  // 1. Verificar configuración
  if (!brokerUrl) {
    // Mostrar error
    return
  }

  // 2. Agregar mensaje del usuario (derecha)
  const userMessage = {
    id: Date.now(),
    text,
    timestamp: new Date(),
    isOwn: true  // ← Alineado a la derecha
  }
  setMessages(prev => [...prev, userMessage])

  // 3. Mostrar loading
  setIsLoading(true)

  try {
    // 4. Crear payload JSON-RPC
    const payload = createBrokerMessage(text)

    // 5. Enviar POST al broker
    const response = await fetch(brokerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // 6. Verificar status
    if (!response.ok) {
      throw error
    }

    // 7. Procesar respuesta
    const responseData = await response.json()
    const responseText = extractBrokerResponseText(responseData)

    // 8. Agregar mensaje del bot (izquierda)
    const botMessage = {
      id: Date.now() + 1,
      text: responseText,
      timestamp: new Date(),
      isOwn: false  // ← Alineado a la izquierda
    }
    setMessages(prev => [...prev, botMessage])

  } catch (err) {
    // 9. Manejar errores
    setError(errorToShow)
    setIsErrorModalOpen(true)
  } finally {
    // 10. Ocultar loading
    setIsLoading(false)
  }
}
```

---

## 🎨 Experiencia de Usuario

### Estados Visuales

#### 1. **Estado Normal**
```
Usuario escribe mensaje → Presiona Enter
```

#### 2. **Estado Loading**
```
┌────────────────────────────────────────────┐
│  Mensaje del usuario              [12:30] │ → Derecha
└────────────────────────────────────────────┘

● ● ● Esperando respuesta...                   → Izquierda
                                                 (animado)

[Input deshabilitado: "Esperando respuesta..."]
```

#### 3. **Estado Con Respuesta**
```
┌────────────────────────────────────────────┐
│  Mensaje del usuario              [12:30] │ → Derecha
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Inventory for material MULETEST0:          │ → Izquierda
│ 1,650,478 units are currently available.   │
│                                    [12:30] │
└────────────────────────────────────────────┘
```

#### 4. **Estado de Error**
```
[Modal emergente]
╔════════════════════════════════╗
║ ⚠️  Error                    ✕ ║
╠════════════════════════════════╣
║ Error del servidor: 500        ║
║ Internal Server Error          ║
║                                ║
║ [Detalles técnicos ▼]          ║
╠════════════════════════════════╣
║              [Cerrar]          ║
╚════════════════════════════════╝
```

---

## 🔧 Configuración Requerida

### Pre-requisitos

1. **Configurar URL del Broker**
   - Ir a Settings
   - Ingresar URL válida (http:// o https://)
   - Guardar configuración

2. **URL debe estar activa**
   - El endpoint debe aceptar POST
   - Debe responder con JSON-RPC 2.0
   - Content-Type: application/json

### Ejemplo de Configuración

```
Settings → MuleSoft Agent Broker URL
https://mf-large-fgw-3s0w0o.9vp9k8.deu-c1.cloudhub.io/broker-interactions/
```

---

## 🧪 Testing

### Test Manual - Flujo Completo

1. **Configurar Broker**
   ```
   1. Abrir Settings
   2. Ingresar URL del broker
   3. Guardar
   4. Volver a Conversations
   ```

2. **Enviar Mensaje**
   ```
   1. Escribir: "Check inventory for MULETEST0"
   2. Presionar Enter
   3. Ver mensaje en la derecha
   4. Ver indicador de loading
   5. Ver respuesta en la izquierda
   ```

3. **Simular Error**
   ```
   1. Configurar URL inválida: http://invalid-url
   2. Enviar mensaje
   3. Verificar que aparezca modal de error
   4. Cerrar modal
   ```

### Test con cURL

Para probar el endpoint del broker:

```bash
curl -X POST 'https://broker-url/endpoint' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 12345,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "kind": "message",
        "parts": [
          {
            "kind": "text",
            "text": "Test message"
          }
        ],
        "messageId": "test-uuid"
      },
      "metadata": {}
    }
  }'
```

Respuesta esperada:
```json
{
  "id": 12345,
  "jsonrpc": "2.0",
  "result": {
    "artifacts": [
      {
        "parts": [
          {
            "kind": "text",
            "text": "Response from broker"
          }
        ]
      }
    ]
  }
}
```

---

## 🐛 Manejo de Errores

### Tipos de Error

#### 1. **URL No Configurada**
```javascript
Error: {
  message: "URL del broker no configurada",
  details: "Por favor, configura la URL del MuleSoft Agent Broker..."
}
```
**Solución**: Ir a Settings y configurar URL

#### 2. **Error HTTP (≠ 200)**
```javascript
Error: {
  status: 500,
  statusText: "Internal Server Error",
  message: "Error del servidor: 500 Internal Server Error",
  responseData: {...}
}
```
**Solución**: Verificar que el broker esté funcionando

#### 3. **Respuesta Inválida**
```javascript
Error: {
  message: "Respuesta inválida del broker",
  details: "La respuesta del broker no contiene el formato esperado",
  responseData: {...}
}
```
**Solución**: Verificar que el broker retorne el formato JSON-RPC correcto

#### 4. **Error de Red**
```javascript
Error: {
  message: "Failed to fetch",
  // Error de CORS, timeout, conexión rechazada, etc.
}
```
**Soluciones**:
- Verificar conectividad de red
- Verificar CORS en el servidor
- Verificar que la URL sea accesible

---

## 📊 Estructura de Datos

### Mensaje del Usuario
```javascript
{
  id: 1729012345678,          // timestamp
  text: "User message",        // texto del mensaje
  timestamp: Date,             // fecha/hora
  isOwn: true                  // true = derecha, false = izquierda
}
```

### Mensaje del Bot
```javascript
{
  id: 1729012345679,          // timestamp + 1
  text: "Bot response",        // texto extraído de result.artifacts[0].parts[0].text
  timestamp: Date,             // fecha/hora
  isOwn: false                 // false = izquierda
}
```

---

## 🔐 Seguridad

### CORS
El navegador puede bloquear peticiones si el servidor no tiene CORS configurado:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### HTTPS
Para producción, se recomienda usar HTTPS:
```
✅ https://broker.example.com
❌ http://broker.example.com  (solo para desarrollo)
```

---

## 📝 Logs y Debugging

### Console Logs

```javascript
// Al enviar mensaje
console.log('Enviando mensaje al broker:', payload)

// Al recibir respuesta
console.log('Respuesta del broker:', responseData)

// Al extraer texto
console.log('Texto extraído:', responseText)

// Al error
console.error('Error al enviar mensaje al broker:', err)
```

### DevTools Network

1. Abrir DevTools (F12)
2. Ir a Network tab
3. Enviar mensaje
4. Ver request a broker:
   - Request Headers
   - Request Payload (JSON-RPC)
   - Response Status
   - Response Data

---

## 🎯 Próximas Mejoras (Futuras)

- [ ] Timeout configurable para peticiones
- [ ] Retry automático en caso de error temporal
- [ ] Historial de conversaciones persistente
- [ ] Múltiples conversaciones simultáneas
- [ ] Indicador de "escribiendo..." (typing indicator)
- [ ] Soporte para otros tipos de `parts` (imágenes, archivos)
- [ ] Streaming de respuestas largas
- [ ] WebSocket para comunicación bidireccional

---

**Versión**: 1.1.0  
**Última actualización**: 2025-10-15

