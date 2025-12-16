# Configuración del Sistema de Emails

## 📧 Sistema Implementado

Se ha implementado un sistema completo de emails con Nodemailer que incluye:

### ✅ Tipos de Emails
1. **Email de Verificación** - Enviado al registrarse
2. **Email de Bienvenida** - Enviado al verificar el email
3. **Email de Recuperación de Contraseña** - Para reset de password
4. **Email de Recompensa Desbloqueada** - Notifica cuando se gana una recompensa

### 📁 Archivos Creados
- `src/module/email/email.service.ts` - Servicio con 4 métodos de envío
- `src/module/email/email.module.ts` - Módulo para inyección de dependencias
- Templates HTML profesionales con estilos inline para compatibilidad

### 🔌 Integración Realizada
- ✅ EmailModule importado en AppModule
- ✅ EmailModule importado en UsersModule
- ✅ EmailService inyectado en UsersService
- ✅ Email de verificación enviado al crear usuario
- ✅ Email de bienvenida enviado al verificar email
- ✅ Endpoint POST `/users/verify-email` creado

---

## 🚀 Configuración para Gmail (Recomendado)

### Paso 1: Activar Verificación en 2 Pasos
1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. En "Verificación en dos pasos", actívala si no lo está

### Paso 2: Generar Contraseña de Aplicación
1. Ve a: https://myaccount.google.com/apppasswords
2. En "Seleccionar app", elige "Correo"
3. En "Seleccionar dispositivo", elige "Otro (nombre personalizado)"
4. Escribe "Habit Go Backend"
5. Haz clic en "Generar"
6. **Copia la contraseña de 16 caracteres** (sin espacios)

### Paso 3: Configurar Variables de Entorno
Agrega estas variables a tu archivo `.env`:

```env
# EMAIL (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # La contraseña de app generada
EMAIL_FROM_NAME=Habit Go
EMAIL_SECURE=false
```

---

## 🧪 Probar el Sistema

### 1. Registrar un nuevo usuario
```bash
POST http://localhost:3000/users/create
Content-Type: application/json

{
  "username": "testuser",
  "email": "tu-email-de-prueba@gmail.com",
  "password": "Test123!",
  "fullName": "Usuario de Prueba"
}
```

Deberías recibir un email de verificación.

### 2. Verificar el email
Copia el token del email recibido y llama:

```bash
POST http://localhost:3000/users/verify-email
Content-Type: application/json

{
  "email": "tu-email-de-prueba@gmail.com",
  "token": "el-token-que-recibiste"
}
```

Deberías recibir un email de bienvenida.

---

## 🔧 Alternativas a Gmail

### SendGrid (Más profesional)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=tu-api-key-de-sendgrid
EMAIL_FROM_NAME=Habit Go
EMAIL_SECURE=false
```

### Mailtrap (Solo para desarrollo/testing)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu-username-mailtrap
EMAIL_PASSWORD=tu-password-mailtrap
EMAIL_FROM_NAME=Habit Go
EMAIL_SECURE=false
```

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu-email@outlook.com
EMAIL_PASSWORD=tu-password
EMAIL_FROM_NAME=Habit Go
EMAIL_SECURE=false
```

---

## 🐛 Troubleshooting

### Error: "Invalid login"
- Verifica que la contraseña de aplicación esté correcta
- Asegúrate de que la verificación en 2 pasos esté activada

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Algunos proveedores de internet bloquean el puerto 587
- Prueba con EMAIL_PORT=465 y EMAIL_SECURE=true

### No recibo los emails
- Revisa la carpeta de spam/correo no deseado
- Verifica que EMAIL_USER esté correcto
- Revisa los logs de la consola del backend

### Los emails se ven mal
- Los templates usan estilos inline para máxima compatibilidad
- Funcionan en Gmail, Outlook, Apple Mail, etc.

---

## 📝 Próximos Pasos Pendientes

1. **Password Reset**: Implementar endpoints de forgot/reset password
2. **Email de Recompensa**: Integrar en RewardService cuando se desbloquee
3. **Plantillas personalizables**: Mover templates a archivos .html separados
4. **Cola de emails**: Usar Bull/BullMQ para envíos en background
5. **Tracking**: Agregar analytics de apertura/clicks (opcional)

---

## 📊 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/users/create` | Crea usuario y envía email de verificación |
| POST | `/users/verify-email` | Verifica email y envía email de bienvenida |

---

**¡Sistema de emails listo para usar!** 🎉
