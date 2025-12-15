# 🔄 Sistema de Refresh Tokens - Guía de Uso

## 📋 Endpoints Implementados

### 1. **Login** (Actualizado)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "userData": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "user@example.com",
    "avatar": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
}
```

---

### 2. **Refresh Token** (Nuevo)
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
}
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4..."
}
```

---

### 3. **Logout** (Nuevo)
```http
POST /auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
}
```

**Respuesta:**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### 4. **Logout All Devices** (Nuevo)
```http
POST /auth/logout-all
Authorization: Bearer <accessToken>
```

**Respuesta:**
```json
{
  "message": "Todas las sesiones cerradas exitosamente"
}
```

---

## 🎯 Implementación en Frontend (React/Next.js)

### Estructura de Almacenamiento

```typescript
// utils/auth.ts

// Guardar tokens en localStorage
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Obtener tokens
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

// Limpiar tokens
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
```

---

### Axios Interceptor para Auto-Refresh

```typescript
// utils/axios.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor: agregar token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: manejar token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Intentar refrescar el token
        const { data } = await axios.post('http://localhost:3000/auth/refresh', {
          refreshToken,
        });

        // Guardar nuevos tokens
        saveTokens(data.accessToken, data.refreshToken);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, logout
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### Hook de Autenticación

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '@/utils/axios';
import { saveTokens, clearTokens, getAccessToken } from '@/utils/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token al cargar
    const token = getAccessToken();
    if (token) {
      // Opcional: verificar token con backend
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.userData);
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const fetchUser = async () => {
    try {
      // Endpoint para obtener usuario actual
      const { data } = await api.get('/users/me');
      setUser(data);
    } catch (error) {
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  return { user, login, logout, logoutAll, loading };
}
```

---

## 🔒 Seguridad

### Características Implementadas:

✅ **Tokens únicos y aleatorios** (64 bytes)  
✅ **Expiración configurable** (default: 7 días)  
✅ **Revocación de tokens** (logout individual o global)  
✅ **Rotación de tokens** (cada refresh genera nuevo token)  
✅ **Tracking de dispositivos** (user-agent e IP)  
✅ **Validación de usuario activo**  
✅ **Limpieza automática de tokens expirados**

### Base de Datos:

Tabla `refresh_tokens`:
- `id`: UUID
- `token`: String único
- `user_id`: Relación con usuario
- `expires_at`: Fecha de expiración
- `is_revoked`: Boolean
- `user_agent`: Info del dispositivo
- `ip_address`: IP del cliente
- `created_at`: Timestamp

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Access Token: corta duración (recomendado: 15m - 1h)
JWT_EXPIRES_IN=1h

# Refresh Token: larga duración (recomendado: 7d - 30d)
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## 🧪 Testing con cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Refresh
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN_AQUI"
  }'
```

### 3. Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN_AQUI"
  }'
```

### 4. Logout All
```bash
curl -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

---

## 📊 Flujo de Autenticación

```
1. Usuario hace login
   ↓
2. Backend genera:
   - Access Token (corta duración)
   - Refresh Token (larga duración, guardado en DB)
   ↓
3. Frontend guarda ambos tokens
   ↓
4. Cada request usa Access Token
   ↓
5. Access Token expira (después de 1h)
   ↓
6. Frontend detecta 401
   ↓
7. Frontend usa Refresh Token para obtener nuevos tokens
   ↓
8. Backend valida Refresh Token y genera nuevos
   ↓
9. Refresh Token viejo se revoca
   ↓
10. Frontend reintenta request con nuevo Access Token
```

---

## 🚀 Ventajas

- ✅ **Seguridad mejorada**: Access tokens de corta duración
- ✅ **Mejor UX**: Usuario no tiene que re-autenticarse frecuentemente
- ✅ **Control granular**: Revocar sesiones específicas o todas
- ✅ **Auditoría**: Tracking de dispositivos y IPs
- ✅ **Escalabilidad**: Tokens guardados en DB, fácil de gestionar

---

## 🎯 Próximos Pasos Recomendados

1. **Implementar limpieza periódica** de tokens expirados (cron job)
2. **Dashboard de sesiones activas** para el usuario
3. **Notificaciones** de nuevo login desde dispositivo desconocido
4. **Rate limiting** más estricto en `/auth/refresh`
5. **2FA** como capa adicional de seguridad
