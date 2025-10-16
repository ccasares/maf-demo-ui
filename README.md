# MAF UI - Interfaz Conversacional

Una aplicación web moderna con interfaz conversacional estilo WhatsApp, construida con React y Vite.

## Características

- ✨ Menú lateral con dos secciones: Conversations y Settings
- 💬 Vista de conversación con burbujas de mensaje estilo WhatsApp
- 🔗 **Integración completa con MuleSoft Agent Broker:**
  - Comunicación JSON-RPC 2.0
  - Envío automático de mensajes al broker vía POST
  - Visualización de respuestas en tiempo real
  - Indicador de loading durante peticiones
  - Manejo robusto de errores con modal informativo
- ⚙️ Configuración de MuleSoft Agent Broker URL con:
  - Validación de formato URL
  - Almacenamiento en cookies (persistencia entre sesiones)
  - Retroalimentación visual (éxito/error)
- 📱 Diseño responsive que se adapta a diferentes tamaños de pantalla
- 🎨 Tema oscuro moderno
- ⚡ Desarrollo rápido con Vite y Hot Module Replacement

## Estructura del Proyecto

```
maf-ui/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx           # Menú lateral con navegación
│   │   ├── ConversationView.jsx  # Vista principal de conversación
│   │   ├── MessageBubble.jsx     # Componente de burbuja de mensaje
│   │   ├── MessageInput.jsx      # Input para escribir mensajes
│   │   ├── Settings.jsx          # Vista de configuración
│   │   ├── ErrorModal.jsx        # Modal para mostrar errores
│   │   ├── LoadingIndicator.jsx  # Indicador de carga
│   │   └── *.css                 # Estilos de cada componente
│   ├── utils/
│   │   ├── cookies.js            # Utilidades para manejo de cookies
│   │   └── helpers.js            # Utilidades para JSON-RPC y UUIDs
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## Instalación

1. Instalar las dependencias:

```bash
npm install
```

## Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

## Build

Para crear la versión de producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## Preview

Para previsualizar la versión de producción:

```bash
npm run preview
```

## Uso

1. **Menú Lateral (20% de la pantalla):**
   - **Conversations:** Muestra la vista de conversación
   - **Settings:** Muestra la vista de configuración

2. **Vista de Conversación:**
   - **Mensajes del usuario:** Aparecen como burbujas alineadas a la derecha
   - **Respuestas del broker:** Aparecen como burbujas alineadas a la izquierda
   - Marca de tiempo en cada mensaje
   - Scroll automático al último mensaje
   - Indicador de "Esperando respuesta..." mientras se procesa
   - Campo de texto en la parte inferior para escribir mensajes
   - Presiona Enter o el botón de envío para enviar un mensaje
   - El mensaje se envía automáticamente al MuleSoft Agent Broker configurado
   - Las respuestas se muestran en tiempo real

3. **Vista de Settings:**
   - **MuleSoft Agent Broker URL:** Campo para configurar la URL del broker
   - Validación automática del formato URL (debe comenzar con http:// o https://)
   - Botón de guardar que:
     - Valida el formato de la URL
     - Almacena la URL en el estado de la aplicación
     - Guarda la URL en una cookie (válida por 1 año)
     - Muestra confirmación visual al guardar exitosamente
   - La URL se carga automáticamente desde la cookie al abrir la aplicación

## Tecnologías

- React 18
- Vite 5
- React Icons
- CSS Vanilla (sin frameworks)
- Fetch API para comunicación con broker
- JSON-RPC 2.0 para protocolo de mensajería

## Documentación Adicional

- **[BROKER_INTEGRATION.md](BROKER_INTEGRATION.md)** - Guía completa de integración con MuleSoft Agent Broker
- **[SETTINGS_GUIDE.md](SETTINGS_GUIDE.md)** - Guía de configuración detallada
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Lista de verificación de pruebas
- **[QUICK_START.md](QUICK_START.md)** - Guía de inicio rápido
- **[CHANGELOG.md](CHANGELOG.md)** - Registro de cambios
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen del proyecto

## Licencia

ISC
