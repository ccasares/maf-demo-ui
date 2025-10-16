# 🚀 Quick Start - Settings con MuleSoft Broker URL

## ✅ ¡Implementación Completada!

La funcionalidad de configuración de MuleSoft Agent Broker URL está **completamente implementada y funcionando**.

---

## 🎯 Acceso Rápido

### 1. Verificar que el servidor esté corriendo

```bash
# El servidor ya está corriendo en:
http://localhost:3000
```

Si necesitas iniciarlo manualmente:
```bash
cd /Users/ccasares/maf-ui
npm run dev
```

### 2. Acceder a la Aplicación

1. Abre tu navegador en: **http://localhost:3000**
2. Verás el menú lateral a la izquierda con dos opciones:
   - 💬 **Conversations**
   - ⚙️ **Settings** ← Haz clic aquí

---

## 📝 Cómo Usar Settings

### Paso 1: Ir a Settings
- Haz clic en **Settings** (⚙️) en el menú lateral

### Paso 2: Configurar la URL
- Ingresa una URL válida en el campo **"MuleSoft Agent Broker URL"**
- Ejemplo: `https://broker.mulesoft.com`
- La URL debe comenzar con `http://` o `https://`

### Paso 3: Guardar
- Haz clic en el botón **"Guardar"**
- Verás una confirmación verde ✓
- ¡Listo! La URL está guardada

### Paso 4: Verificar Persistencia
- Recarga la página (F5)
- Ve a Settings nuevamente
- ¡La URL sigue ahí! 🎉

---

## 🎨 Características Visuales

### Estados del Campo

**Normal:**
```
┌────────────────────────────────────┐
│ https://example.com                │  ← Borde gris
└────────────────────────────────────┘
```

**Error (URL inválida):**
```
┌────────────────────────────────────┐
│ example.com                      ⚠ │  ← Borde rojo + ícono de error
└────────────────────────────────────┘
❌ Por favor, ingresa una URL válida...
```

**Éxito (URL guardada):**
```
┌────────────────────────────────────┐
│ https://example.com              ✓ │  ← Borde verde + checkmark
└────────────────────────────────────┘
✅ URL guardada correctamente
```

---

## 🔍 Verificar en DevTools

### Inspeccionar la Cookie

1. Abre DevTools (F12)
2. Ve a la pestaña **Application**
3. En el menú lateral: **Storage > Cookies > http://localhost:3000**
4. Busca: `mulesoft_broker_url`

Deberías ver:

| Name | Value | Expires |
|------|-------|---------|
| mulesoft_broker_url | https://broker.mulesoft.com | (365 días) |

---

## 📊 Estructura de Archivos Nuevos

```
src/
├── components/
│   ├── Settings.jsx          ← Componente principal
│   └── Settings.css          ← Estilos del componente
└── utils/
    └── cookies.js            ← Utilidades (getCookie, setCookie, isValidURL)

Documentación:
├── SETTINGS_GUIDE.md         ← Guía detallada
├── TESTING_CHECKLIST.md      ← Lista de pruebas
├── CHANGELOG.md              ← Registro de cambios
└── QUICK_START.md            ← Este archivo
```

---

## 🧪 Prueba Rápida (2 minutos)

### Test 1: Guardar URL
```
1. Abre http://localhost:3000
2. Clic en Settings
3. Ingresa: https://test.example.com
4. Clic en Guardar
5. ¿Ves el checkmark verde? ✓
```

### Test 2: Validación
```
1. Borra el campo
2. Ingresa: ejemplo.com (sin http://)
3. Clic fuera del campo
4. ¿Ves el error rojo? ⚠️
```

### Test 3: Persistencia
```
1. Guarda una URL válida
2. Recarga la página (F5)
3. Ve a Settings
4. ¿La URL sigue ahí? ✓
```

---

## 🎓 Ejemplos de Uso

### Ejemplo 1: URL de Producción
```javascript
URL: https://broker.mulesoft.com/api/v1
✅ Válida - Protocolo HTTPS
✅ Guardada en cookie por 1 año
```

### Ejemplo 2: URL de Desarrollo Local
```javascript
URL: http://localhost:8080/broker
✅ Válida - Protocolo HTTP permitido para localhost
✅ Guardada en cookie
```

### Ejemplo 3: URL con Puerto
```javascript
URL: https://192.168.1.100:3000/api
✅ Válida - IP con puerto
✅ Guardada en cookie
```

### Ejemplo 4: URL Inválida
```javascript
URL: broker.mulesoft.com
❌ Inválida - Falta protocolo (http:// o https://)
❌ No se puede guardar
```

---

## 🔧 Uso Programático

Si necesitas acceder a la URL guardada desde el código:

```javascript
// En cualquier componente
import { getCookie } from './utils/cookies'

function MiComponente() {
  // Obtener la URL del broker
  const brokerUrl = getCookie('mulesoft_broker_url')
  
  if (brokerUrl) {
    // Usar la URL para hacer peticiones
    fetch(`${brokerUrl}/endpoint`, {...})
  }
}
```

### Ejemplo de Integración
```javascript
import { getCookie } from './utils/cookies'

// Función para enviar mensaje al broker
async function sendToMuleSoftBroker(message) {
  const brokerUrl = getCookie('mulesoft_broker_url')
  
  if (!brokerUrl) {
    console.error('Broker URL no configurada')
    return
  }
  
  try {
    const response = await fetch(`${brokerUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
  }
}
```

---

## 💡 Tips y Mejores Prácticas

### ✅ Hacer
- Usar URLs completas con protocolo
- Verificar la configuración en Settings antes de usar la app
- Probar la conexión después de guardar la URL
- Usar HTTPS en producción

### ❌ Evitar
- URLs sin protocolo (`example.com`)
- Protocolos no soportados (`ftp://`)
- URLs con espacios
- URLs malformadas

---

## 🐛 Troubleshooting

### Problema: "La URL no se guarda"
**Solución:**
1. Verifica que la URL sea válida
2. Asegúrate de hacer clic en "Guardar"
3. Verifica que no haya errores en la consola (F12)
4. Verifica que las cookies estén habilitadas en el navegador

### Problema: "La URL desaparece al recargar"
**Solución:**
1. Verifica que las cookies estén habilitadas
2. Revisa DevTools > Application > Cookies
3. Asegúrate de que la cookie `mulesoft_broker_url` exista
4. Si usas modo incógnito, las cookies se borran al cerrar

### Problema: "El botón Guardar está deshabilitado"
**Solución:**
1. Verifica que la URL sea válida (http:// o https://)
2. Asegúrate de que el campo no esté vacío
3. Si la URL ya está guardada, cámbiala a algo diferente

---

## 📚 Documentación Adicional

- **SETTINGS_GUIDE.md** - Guía detallada de uso
- **TESTING_CHECKLIST.md** - Lista completa de pruebas
- **CHANGELOG.md** - Registro detallado de cambios
- **README.md** - Documentación general del proyecto

---

## ✨ Resumen

🎉 **¡Todo está listo y funcionando!**

- ✅ Componente Settings implementado
- ✅ Validación de URL funcional
- ✅ Almacenamiento en cookies activo
- ✅ Persistencia funcionando
- ✅ UI moderna y responsive
- ✅ Sin errores de linting
- ✅ Documentación completa

**Siguiente paso:** ¡Abre http://localhost:3000 y pruébalo!

---

**¿Preguntas?** Revisa los archivos de documentación o abre DevTools para inspeccionar.

