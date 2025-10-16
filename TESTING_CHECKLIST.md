# ✅ Lista de Verificación - Settings Functionality

## Pruebas de la Nueva Funcionalidad de Settings

### 🎯 Pre-requisitos
- [ ] Servidor de desarrollo ejecutándose (`npm run dev`)
- [ ] Navegador abierto en http://localhost:3000
- [ ] DevTools disponibles (F12)

---

## 📋 Tests Funcionales

### Test 1: Navegación a Settings
- [ ] Haz clic en el menú "Settings" en la barra lateral
- [ ] **Resultado esperado**: Se muestra la vista de Settings con el formulario
- [ ] **Resultado esperado**: Título "Settings" visible
- [ ] **Resultado esperado**: Campo "MuleSoft Agent Broker URL" visible

### Test 2: Validación de URL - Formato Inválido
**Pasos:**
1. [ ] Haz clic en el campo de texto
2. [ ] Escribe: `ejemplo.com` (sin protocolo)
3. [ ] Haz clic fuera del campo (blur)

**Resultados esperados:**
- [ ] El campo muestra borde rojo
- [ ] Aparece ícono de error (⚠️)
- [ ] Mensaje de error visible: "Por favor, ingresa una URL válida..."
- [ ] Botón "Guardar" está deshabilitado

### Test 3: Validación de URL - Formato Válido
**Pasos:**
1. [ ] Borra el contenido anterior
2. [ ] Escribe: `https://broker.mulesoft.com`
3. [ ] Observa el campo mientras escribes

**Resultados esperados:**
- [ ] El campo NO muestra error
- [ ] NO hay ícono de error
- [ ] Botón "Guardar" se habilita
- [ ] Mensaje de ayuda visible debajo del campo

### Test 4: Guardar URL Válida
**Pasos:**
1. [ ] Con una URL válida en el campo
2. [ ] Haz clic en el botón "Guardar"

**Resultados esperados:**
- [ ] Aparece ícono de éxito (✓) en el campo
- [ ] Mensaje "URL guardada correctamente" visible
- [ ] Campo muestra borde verde
- [ ] Aparece sección "Configuración Actual" debajo
- [ ] La URL guardada se muestra en "Configuración Actual"
- [ ] Mensaje de éxito desaparece después de 3 segundos

### Test 5: Persistencia en Cookie
**Pasos:**
1. [ ] Guarda una URL (ej: `https://test.example.com`)
2. [ ] Abre DevTools (F12)
3. [ ] Ve a Application > Storage > Cookies > http://localhost:3000
4. [ ] Busca la cookie `mulesoft_broker_url`

**Resultados esperados:**
- [ ] Cookie `mulesoft_broker_url` existe
- [ ] Valor de la cookie es `https://test.example.com`
- [ ] Fecha de expiración es ~1 año en el futuro

### Test 6: Recarga de Página - Persistencia
**Pasos:**
1. [ ] Con una URL guardada
2. [ ] Recarga la página (F5 o Cmd/Ctrl + R)
3. [ ] Ve a Settings

**Resultados esperados:**
- [ ] El campo muestra la URL guardada anteriormente
- [ ] La sección "Configuración Actual" muestra la URL
- [ ] NO aparece mensaje de éxito (es carga, no guardado nuevo)

### Test 7: Cambio de Vista
**Pasos:**
1. [ ] Estando en Settings con URL guardada
2. [ ] Haz clic en "Conversations"
3. [ ] Vuelve a hacer clic en "Settings"

**Resultados esperados:**
- [ ] La URL sigue visible en el campo
- [ ] Los datos no se pierden al cambiar de vista
- [ ] La UI se mantiene consistente

### Test 8: Botón Deshabilitado - Sin Cambios
**Pasos:**
1. [ ] Con una URL ya guardada visible
2. [ ] NO hagas cambios en el campo
3. [ ] Observa el botón "Guardar"

**Resultados esperados:**
- [ ] Botón "Guardar" está deshabilitado
- [ ] Solo se habilita si modificas la URL

### Test 9: Actualizar URL Existente
**Pasos:**
1. [ ] Con URL guardada: `https://old.example.com`
2. [ ] Cambia a: `https://new.example.com`
3. [ ] Haz clic en "Guardar"

**Resultados esperados:**
- [ ] Mensaje de éxito aparece
- [ ] "Configuración Actual" se actualiza con la nueva URL
- [ ] Cookie se actualiza en DevTools

### Test 10: Campo Vacío
**Pasos:**
1. [ ] Borra todo el contenido del campo
2. [ ] Observa el comportamiento

**Resultados esperados:**
- [ ] NO muestra error (campo vacío es válido)
- [ ] Botón "Guardar" está deshabilitado
- [ ] NO aparece ícono de error

---

## 🎨 Tests de UI/UX

### UI-1: Colores y Tema
- [ ] El formulario usa colores del tema oscuro
- [ ] El campo de texto tiene fondo oscuro
- [ ] Los textos son legibles con buen contraste
- [ ] El botón verde es visible y llamativo

### UI-2: Animaciones
- [ ] Mensaje de éxito aparece con animación suave
- [ ] Ícono de éxito tiene animación de "pulse"
- [ ] Transiciones de color son suaves (no abruptas)
- [ ] Botón tiene efecto hover

### UI-3: Feedback Visual
- [ ] Estados del campo son claros (normal/error/éxito)
- [ ] Íconos son apropiados y visibles
- [ ] Mensajes son legibles y útiles
- [ ] Botón deshabilitado se ve claramente deshabilitado

---

## 📱 Tests Responsive

### Mobile (< 480px)
- [ ] Abre DevTools y cambia a vista móvil (iPhone/Android)
- [ ] El formulario se adapta al ancho de pantalla
- [ ] El campo de texto es usable
- [ ] El botón es fácil de presionar
- [ ] Los textos son legibles

### Tablet (480px - 768px)
- [ ] Cambia a vista tablet en DevTools
- [ ] El layout se ve bien
- [ ] Los elementos tienen buen espaciado
- [ ] La interfaz es cómoda de usar

### Desktop (> 768px)
- [ ] En pantalla completa
- [ ] El formulario no se estira demasiado (max-width: 800px)
- [ ] Centrado y bien espaciado
- [ ] Fácil de leer y usar

---

## 🔧 Tests Técnicos (DevTools)

### DevTools-1: Console Errors
**Pasos:**
1. [ ] Abre DevTools Console
2. [ ] Navega a Settings
3. [ ] Guarda una URL

**Resultados esperados:**
- [ ] NO hay errores en la consola
- [ ] NO hay warnings relacionados con React
- [ ] NO hay errores de red

### DevTools-2: Cookies
**Pasos:**
1. [ ] Abre Application > Cookies
2. [ ] Verifica `mulesoft_broker_url`

**Resultados esperados:**
- [ ] Cookie tiene el valor correcto
- [ ] Path es `/`
- [ ] Expires es ~365 días
- [ ] SameSite está configurado

### DevTools-3: React DevTools (si instalado)
**Pasos:**
1. [ ] Abre React DevTools
2. [ ] Inspecciona componente `<Settings>`
3. [ ] Observa el estado y props

**Resultados esperados:**
- [ ] Prop `brokerUrl` tiene el valor correcto
- [ ] Función `onSaveBrokerUrl` está definida
- [ ] Estado local del componente se actualiza correctamente

---

## 🚀 Tests de Integración

### INT-1: Estado de App
**Pasos:**
1. [ ] Guarda URL en Settings
2. [ ] Abre React DevTools
3. [ ] Inspecciona componente `<App>`

**Resultados esperados:**
- [ ] Estado `brokerUrl` en App tiene el valor guardado
- [ ] El estado se sincroniza correctamente

### INT-2: Flujo Completo
**Pasos:**
1. [ ] Limpia todas las cookies
2. [ ] Recarga la página
3. [ ] Ve a Settings
4. [ ] Ingresa y guarda una URL
5. [ ] Ve a Conversations
6. [ ] Vuelve a Settings
7. [ ] Recarga la página
8. [ ] Ve a Settings

**Resultados esperados:**
- [ ] Flujo completo funciona sin errores
- [ ] URL persiste en todos los pasos
- [ ] No hay pérdida de datos

---

## ✨ Tests de Accesibilidad

### A11y-1: Navegación con Teclado
- [ ] Usa Tab para navegar al campo
- [ ] Campo recibe focus visual claro
- [ ] Tab llega al botón Guardar
- [ ] Enter en el campo envía el formulario
- [ ] Enter en el botón guarda la URL

### A11y-2: Labels y Semántica
- [ ] El campo tiene un `<label>` asociado
- [ ] El label es descriptivo
- [ ] El placeholder es útil
- [ ] Los mensajes de error son descriptivos

---

## 🎯 Criterios de Aceptación Final

- [ ] ✅ Todos los tests funcionales pasan
- [ ] ✅ UI es consistente y atractiva
- [ ] ✅ Responsive funciona en mobile/tablet/desktop
- [ ] ✅ No hay errores en console
- [ ] ✅ Cookies funcionan correctamente
- [ ] ✅ Persistencia funciona después de recargar
- [ ] ✅ Validación funciona como se espera
- [ ] ✅ Feedback visual es claro y útil

---

## 📊 Resultado

- **Total de Tests**: 40+
- **Tests Pasados**: ____
- **Tests Fallidos**: ____
- **Bloqueadores**: ____

---

## 🐛 Reporte de Bugs (si aplica)

Si encuentras algún bug, documéntalo aquí:

**Bug #1:**
- Descripción:
- Pasos para reproducir:
- Resultado esperado:
- Resultado actual:
- Severidad: (Alta/Media/Baja)

---

**Fecha de Test**: _______________
**Tester**: _______________
**Browser**: _______________
**SO**: _______________

