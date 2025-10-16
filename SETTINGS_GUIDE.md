# Guía de Configuración - MuleSoft Agent Broker URL

## 🎯 Descripción

La sección de **Settings** permite configurar la URL del MuleSoft Agent Broker, que se utilizará para conectar la aplicación con los servicios de MuleSoft.

## 📝 Cómo Usar

### 1. Acceder a Settings
- Haz clic en el menú **Settings** (⚙️) en la barra lateral izquierda

### 2. Configurar la URL
1. En el campo **"MuleSoft Agent Broker URL"**, ingresa la URL del broker
2. La URL debe comenzar con `http://` o `https://`
3. Ejemplo: `https://broker.mulesoft.com/api/v1`

### 3. Validación
- ✅ **URL válida**: El campo se mostrará con borde verde
- ❌ **URL inválida**: El campo se mostrará con borde rojo y un mensaje de error
- 💡 El campo se valida automáticamente al escribir

### 4. Guardar Configuración
1. Haz clic en el botón **"Guardar"**
2. Si la URL es válida, verás un ícono de confirmación ✓
3. La URL se guarda automáticamente en dos lugares:
   - **Estado de la aplicación** (para uso inmediato)
   - **Cookie del navegador** (para persistencia)

### 5. Persistencia
- La URL se guarda en una cookie con **validez de 1 año**
- Al volver a abrir la aplicación, la URL se carga automáticamente
- No necesitas volver a configurarla cada vez que uses la aplicación

## 🔧 Características Técnicas

### Validación
- La URL debe tener un formato válido
- Solo se aceptan protocolos `http://` o `https://`
- El botón "Guardar" solo se activa si:
  - La URL es válida
  - La URL tiene contenido
  - La URL es diferente a la guardada actualmente

### Almacenamiento
```javascript
Cookie: mulesoft_broker_url
Duración: 365 días
Path: /
```

### API de Cookies
El proyecto incluye utilidades para manejar cookies:

```javascript
// Obtener cookie
import { getCookie } from './utils/cookies'
const url = getCookie('mulesoft_broker_url')

// Guardar cookie
import { setCookie } from './utils/cookies'
setCookie('mulesoft_broker_url', 'https://example.com', 365)

// Validar URL
import { isValidURL } from './utils/cookies'
const isValid = isValidURL('https://example.com') // true
```

## 📊 Vista de Configuración Actual

Una vez guardada la URL, verás una sección **"Configuración Actual"** que muestra:
- La URL actualmente configurada
- Formato legible y copiable

## 🎨 Feedback Visual

### Estados del Campo
- **Normal**: Borde gris, fondo oscuro
- **Focus**: Borde verde brillante
- **Error**: Borde rojo, fondo rojo translúcido
- **Éxito**: Borde verde, fondo verde translúcido con ícono ✓

### Mensajes
- **Error**: "Por favor, ingresa una URL válida (debe comenzar con http:// o https://)"
- **Éxito**: "URL guardada correctamente" (desaparece después de 3 segundos)
- **Ayuda**: "Ingresa la URL del MuleSoft Agent Broker..."

## 🔄 Carga Automática

Al iniciar la aplicación:
```javascript
1. La aplicación busca la cookie 'mulesoft_broker_url'
2. Si existe, carga el valor en el estado
3. El componente Settings muestra la URL en el campo
4. La sección "Configuración Actual" se muestra automáticamente
```

## 💡 Ejemplos de URLs Válidas

✅ URLs correctas:
```
https://broker.mulesoft.com
https://api.example.com/broker/v1
http://localhost:8080/broker
https://192.168.1.100:3000/api
```

❌ URLs incorrectas:
```
broker.mulesoft.com           (falta protocolo)
ftp://broker.mulesoft.com     (protocolo no soportado)
//example.com                 (falta protocolo)
example                       (no es URL)
```

## 🧪 Testing Manual

Para probar la funcionalidad:

1. **Test 1 - Guardar URL**
   - Ve a Settings
   - Ingresa `https://test.example.com`
   - Haz clic en Guardar
   - Verifica el mensaje de éxito

2. **Test 2 - Persistencia**
   - Guarda una URL
   - Recarga la página (F5)
   - Ve a Settings
   - Verifica que la URL sigue ahí

3. **Test 3 - Validación**
   - Intenta ingresar `ejemplo.com` (sin http://)
   - Verifica que muestre error
   - Intenta guardar (el botón debe estar deshabilitado)

4. **Test 4 - Limpiar Cookie**
   - Abre DevTools (F12)
   - Ve a Application > Cookies
   - Elimina `mulesoft_broker_url`
   - Recarga la página
   - Verifica que el campo esté vacío

## 🔐 Seguridad y Privacidad

- Las cookies se almacenan **solo en el navegador del usuario**
- No se envía información a servidores externos
- La URL solo se usa localmente en la aplicación
- Los datos persisten **solo en el dispositivo actual**

## 📱 Responsive

La vista de Settings es completamente responsive:
- **Desktop**: Formulario centrado con ancho máximo de 800px
- **Tablet**: Se adapta al ancho disponible
- **Mobile**: Optimizado para pantallas pequeñas

---

¿Preguntas o problemas? Revisa el código en:
- `/src/components/Settings.jsx` - Componente principal
- `/src/utils/cookies.js` - Utilidades de cookies y validación
- `/src/App.jsx` - Integración con la aplicación

