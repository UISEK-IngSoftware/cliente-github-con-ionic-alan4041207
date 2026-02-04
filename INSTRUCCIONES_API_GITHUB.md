# Configuración de la API de GitHub

## ⚠️ IMPORTANTE: El servidor DEBE ser reiniciado después de crear/modificar el archivo .env

## Paso 1: Obtener tu Token de GitHub

1. Ve a https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre descriptivo (ejemplo: "Ionic GitHub Client")
4. Configura la expiración (recomendado: 90 días)
5. **IMPORTANTE:** Selecciona estos permisos:
   - ✅ `repo` (acceso completo a repositorios)
   - ✅ `user` (leer información del usuario)
   - ✅ `delete_repo` (opcional, si quieres borrar repos desde la app)
6. Click en **"Generate token"** al final de la página
7. **¡COPIA EL TOKEN INMEDIATAMENTE!** Empieza con `ghp_...`

## Paso 2: Configurar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Pega tu token:

```env
VITE_GITHUB_API_TOKEN=ghp_TuTokenAquí
```

3. Guarda el archivo

## Paso 3: Reiniciar el servidor

**ESTO ES CRÍTICO - El servidor NO lee cambios en .env sin reiniciar**

1. Detén el servidor (Ctrl+C en la terminal)
2. Vuelve a ejecutar: `npm run dev`
3. La aplicación ahora debería cargar tus repositorios

## Verificar que funciona

Abre la consola del navegador (F12) y busca estos mensajes:

✅ **Si funciona correctamente:**
```
🔑 Token disponible: ghp_9YP6q2...
📍 Origen del token: .env
📡 Solicitando repositorios a GitHub...
✅ Respuesta recibida: 200
📦 X repositorios encontrados
```

❌ **Si hay problemas:**
```
❌ No se encontró ningún token de GitHub
```
→ Reinicia el servidor

```
❌ Error al obtener repositorios:
  - Status: 401
  - Token inválido o expirado
```
→ Genera un nuevo token

```
❌ Error al obtener repositorios:
  - Status: 403
  - Token sin permisos suficientes
```
→ Asegúrate de tener el scope 'repo'

## Alternativa: Login manual

Si no quieres usar el archivo .env, puedes usar el login de la aplicación:

1. Ingresa tu usuario de GitHub
2. Ingresa tu token (el mismo que generaste arriba)
3. Los datos se guardarán en localStorage

## Solución de problemas

### "No se cargan los repositorios"
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca mensajes que empiecen con 🔑, 📡, ❌
4. Sigue las instrucciones que aparezcan en los mensajes de error

### "Token inválido"
- El token expira después del tiempo configurado
- Genera un nuevo token siguiendo el Paso 1

### "Servidor no reiniciado"
- Vite NO recarga automáticamente cambios en .env
- DEBES detener y reiniciar el servidor manualmente
