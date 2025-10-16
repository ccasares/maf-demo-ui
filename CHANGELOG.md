# Changelog - MAF UI

## [1.2.0] - 2025-10-15

### 🚀 Integración con MuleSoft Agent Broker

**Nueva Funcionalidad Mayor:**

#### Comunicación JSON-RPC 2.0
- Integración completa con MuleSoft Agent Broker
- Envío automático de mensajes mediante POST
- Protocolo JSON-RPC 2.0 estándar
- Generación automática de UUIDs y request IDs

#### Visualización de Respuestas
- Mensajes del usuario aparecen a la derecha (verde)
- Respuestas del broker aparecen a la izquierda (gris)
- Extracción automática de texto desde `result.artifacts[0].parts[0].text`
- Scroll automático al último mensaje

#### Indicadores Visuales
- **LoadingIndicator:** Animación de "tres puntos" mientras se espera respuesta
- **Input deshabilitado:** Durante peticiones en curso
- Placeholder dinámico: "Esperando respuesta..."

#### Manejo Robusto de Errores
- **ErrorModal:** Modal informativo para todos los errores
- Detección de URL no configurada
- Manejo de errores HTTP (≠ 200)
- Validación de formato de respuesta
- Errores de red y timeout
- Detalles técnicos expandibles en el modal

**Componentes Añadidos:**
- `src/components/ErrorModal.jsx` - Modal de error con detalles
- `src/components/ErrorModal.css` - Estilos del modal
- `src/components/LoadingIndicator.jsx` - Indicador de carga
- `src/components/LoadingIndicator.css` - Animación de loading
- `src/utils/helpers.js` - Utilidades JSON-RPC, UUIDs, y extracción

**Funciones Utility:**
```javascript
- generateUUID()                    // UUID v4 para messageId
- generateRandomId()                // ID numérico para request
- createBrokerMessage(text)         // Estructura JSON-RPC completa
- extractBrokerResponseText(response) // Extrae texto de respuesta
```

**Archivos Modificados:**
- `src/App.jsx` - Lógica de comunicación con broker
- `src/components/ConversationView.jsx` - Soporte para loading
- `src/components/MessageInput.jsx` - Estado disabled
- `README.md` - Documentación actualizada

**Documentación Nueva:**
- `BROKER_INTEGRATION.md` - Guía completa de integración
- Ejemplos de payloads y respuestas
- Guía de debugging y troubleshooting
- Diagramas de flujo de comunicación

**Mejoras de UX:**
- Input bloqueado durante peticiones
- Feedback visual claro en cada estado
- Errores descriptivos y accionables
- Transiciones suaves entre estados

**Manejo de Estados:**
```javascript
- Normal: Usuario puede escribir
- Loading: Input deshabilitado, indicador visible
- Success: Respuesta mostrada, input habilitado
- Error: Modal con información, input habilitado
```

---

## [1.1.0] - 2025-10-15

### ✨ Nuevas Características

#### Settings - Configuración de MuleSoft Agent Broker URL

**Componentes Añadidos:**
- `src/components/Settings.jsx` - Componente principal de configuración
- `src/components/Settings.css` - Estilos del componente Settings
- `src/utils/cookies.js` - Utilidades para manejo de cookies y validación

**Funcionalidades Implementadas:**

1. **Campo de Configuración de URL**
   - Input de texto para MuleSoft Agent Broker URL
   - Placeholder descriptivo
   - Diseño moderno y consistente con el tema

2. **Validación en Tiempo Real**
   - Validación automática del formato de URL
   - Solo acepta URLs con protocolo `http://` o `https://`
   - Feedback visual inmediato (borde rojo/verde)
   - Íconos de error/éxito
   - Mensajes descriptivos de error

3. **Almacenamiento Persistente**
   - Guardado en cookie `mulesoft_broker_url`
   - Duración: 365 días (1 año)
   - Path: `/` (disponible en toda la aplicación)
   - Almacenamiento automático en estado de React

4. **Carga Automática**
   - Al iniciar la aplicación, se carga la URL desde la cookie
   - Sincronización automática con el estado de la aplicación
   - No requiere reconfiguración en cada visita

5. **Feedback Visual**
   - Animación al guardar exitosamente
   - Mensaje de confirmación (3 segundos)
   - Ícono de checkmark animado
   - Estados visuales claros (normal/error/éxito)

6. **Configuración Actual**
   - Panel que muestra la URL guardada actualmente
   - Formato monospace para fácil lectura
   - Se muestra solo cuando hay una URL guardada

**Archivos Modificados:**
- `src/App.jsx` - Integración del componente Settings
- `src/App.css` - Eliminación de estilos obsoletos
- `README.md` - Actualización de documentación
- `PROJECT_SUMMARY.md` - Actualización del resumen del proyecto

**Utilidades Añadidas:**
```javascript
// src/utils/cookies.js
- getCookie(name)        // Obtener valor de cookie
- setCookie(name, value, days) // Guardar cookie
- deleteCookie(name)     // Eliminar cookie
- isValidURL(string)     // Validar formato URL
```

**Mejoras de UX:**
- Botón "Guardar" solo habilitado cuando:
  - La URL es válida
  - Hay contenido en el campo
  - La URL es diferente a la guardada
- Validación no intrusiva (solo al blur)
- Animaciones suaves y modernas
- Mensajes de ayuda contextuales

**Responsive:**
- Totalmente responsive en mobile/tablet/desktop
- Adaptación inteligente del layout
- Mantiene usabilidad en todas las pantallas

**Accesibilidad:**
- Labels correctamente asociados
- Navegación por teclado funcional
- Enter envía el formulario
- Focus visual claro

---

## [1.0.0] - 2025-10-15

### 🎉 Lanzamiento Inicial

**Características Principales:**

1. **Menú Lateral**
   - Opción Conversations con icono
   - Opción Settings con icono
   - 20% del ancho de pantalla
   - Responsive

2. **Vista de Conversación**
   - Burbujas de mensaje estilo WhatsApp
   - Mensajes alineados a la derecha
   - Timestamp en cada mensaje
   - Scroll automático
   - Animaciones de entrada

3. **Input de Mensajes**
   - Campo de texto en la parte inferior
   - Botón de envío
   - Envío con tecla Enter
   - Validación de mensajes vacíos

4. **Diseño y Tema**
   - Tema oscuro moderno
   - Paleta de colores WhatsApp
   - Variables CSS para fácil personalización
   - Totalmente responsive

**Stack Tecnológico:**
- React 18.2.0
- Vite 5.0.8
- React Icons 4.12.0
- CSS Vanilla (sin frameworks)

---

## Próximas Características Planeadas

- [ ] Integración con MuleSoft Agent Broker
- [ ] Envío de mensajes al broker
- [ ] Recepción de respuestas
- [ ] Historial de conversaciones
- [ ] Múltiples conversaciones
- [ ] Búsqueda en mensajes
- [ ] Adjuntar archivos
- [ ] Emojis
- [ ] Notificaciones
- [ ] Modo claro/oscuro toggle

---

## Notas de Desarrollo

### Dependencias
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.12.0"
}
```

### Scripts NPM
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build de producción
npm run preview # Preview del build
```

### Configuración de Cookies
- Nombre: `mulesoft_broker_url`
- Duración: 365 días
- Path: `/`
- SameSite: Default
- Secure: Según protocolo (HTTPS)

---

**Mantenedores**: Equipo MAF UI
**Licencia**: ISC

