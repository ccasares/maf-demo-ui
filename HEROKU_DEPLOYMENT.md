# 🚀 Heroku Deployment Guide

## Archivos Necesarios (Ya Configurados)

✅ **Procfile** - Le dice a Heroku cómo iniciar la app
✅ **package.json** - Con scripts `heroku-postbuild` y `start`
✅ **serve** - Añadido como dependencia para servir archivos estáticos

---

## 📋 Pasos para Desplegar en Heroku

### 1. Preparar el Repositorio en GitHub

Asegúrate de que todos los archivos estén subidos a GitHub:

```bash
git add .
git commit -m "Configure Heroku deployment"
git push origin main
```

### 2. Crear la App en Heroku

**Opción A: Desde el Dashboard de Heroku**

1. Ve a [https://dashboard.heroku.com](https://dashboard.heroku.com)
2. Click en **"New"** → **"Create new app"**
3. Ingresa un nombre para tu app (ej: `maf-ui-app`)
4. Selecciona región (US o Europe)
5. Click en **"Create app"**

**Opción B: Desde CLI de Heroku**

```bash
heroku login
heroku create maf-ui-app
```

### 3. Conectar GitHub a Heroku

1. En el dashboard de tu app, ve a la pestaña **"Deploy"**
2. En **"Deployment method"**, selecciona **"GitHub"**
3. Click en **"Connect to GitHub"**
4. Autoriza Heroku para acceder a tu GitHub
5. Busca tu repositorio: `maf-ui`
6. Click en **"Connect"**

### 4. Configurar el Buildpack (Opcional pero Recomendado)

1. Ve a la pestaña **"Settings"**
2. En **"Buildpacks"**, click en **"Add buildpack"**
3. Selecciona **"nodejs"**
4. Click en **"Save changes"**

> **Nota:** Heroku detecta automáticamente Node.js por el `package.json`, pero es bueno verificar.

### 5. Desplegar la Aplicación

Tienes dos opciones:

**Opción A: Deploy Manual**

1. En la pestaña **"Deploy"**
2. En **"Manual deploy"**, selecciona la rama `main`
3. Click en **"Deploy Branch"**

**Opción B: Deploy Automático (Recomendado)**

1. En la pestaña **"Deploy"**
2. En **"Automatic deploys"**, selecciona la rama `main`
3. (Opcional) Habilita **"Wait for CI to pass before deploy"**
4. Click en **"Enable Automatic Deploys"**

> Con esta opción, cada push a `main` desplegará automáticamente.

### 6. Verificar el Despliegue

1. Espera a que termine el build (verás los logs en tiempo real)
2. Busca el mensaje: **"Build succeeded!"**
3. Click en **"View"** o **"Open app"** para ver tu aplicación

---

## 🔧 Proceso Automático de Heroku

Cuando despliegas, Heroku ejecuta automáticamente:

```bash
1. npm install                 # Instala dependencias
2. npm run heroku-postbuild   # Ejecuta: vite build
3. npm start                  # Ejecuta: serve -s dist -l $PORT
```

---

## 🌐 Tu App Estará Disponible En

```
https://[nombre-de-tu-app].herokuapp.com
```

Ejemplo: `https://maf-ui-app.herokuapp.com`

---

## 🔍 Ver Logs en Vivo

**Desde el Dashboard:**
- Ve a **"More"** → **"View logs"**

**Desde CLI:**
```bash
heroku logs --tail --app maf-ui-app
```

---

## ⚙️ Variables de Entorno (Si las Necesitas)

Si en el futuro necesitas variables de entorno:

1. Ve a **"Settings"** → **"Config Vars"**
2. Click en **"Reveal Config Vars"**
3. Añade tus variables (ej: `API_KEY`, `BROKER_URL`, etc.)

---

## 🔄 Actualizar la Aplicación

Con deploy automático habilitado:

```bash
# Haz tus cambios
git add .
git commit -m "Update feature"
git push origin main
```

Heroku desplegará automáticamente los cambios.

---

## 🐛 Troubleshooting

### Problema: "Application Error"

**Solución:**
```bash
heroku logs --tail --app maf-ui-app
```

Busca el error específico en los logs.

### Problema: Build Falla

**Causas comunes:**
- Faltan dependencias en `package.json`
- Error en el código
- Version de Node.js incompatible

**Solución:**
```bash
# Verificar que el build funcione localmente
npm install
npm run build
```

### Problema: App no carga después del despliegue

**Solución:**
- Verifica que el `Procfile` exista
- Verifica que `serve` esté en `dependencies` (no en `devDependencies`)

---

## ✅ Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] `Procfile` creado
- [ ] `package.json` actualizado con scripts
- [ ] `serve` en dependencies
- [ ] App creada en Heroku
- [ ] GitHub conectado a Heroku
- [ ] Buildpack Node.js configurado
- [ ] Deploy manual o automático habilitado
- [ ] App funcionando en: `https://[tu-app].herokuapp.com`

---

## 📚 Recursos Adicionales

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Deploying with Git](https://devcenter.heroku.com/articles/git)

---

**¡Listo!** Tu aplicación MuleSoft Agent Fabric UI está ahora desplegada en Heroku 🎉

