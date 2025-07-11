# 🦷 Aplicación Web - Consultorio Odontológico

## 📃 Descripción del Proyecto

Esta aplicación web permite gestionar de forma integral las operaciones de un consultorio odontológico, optimizando la comunicación entre pacientes, odontólogos y administradores. A través de una interfaz moderna y responsiva, desarrollada con **Angular** en el frontend y **Node.js** en el backend, el sistema facilita:

- El **registro y login de usuarios** (pacientes, odontólogos y administradores).
- La **reserva, modificación y cancelación de turnos** según la disponibilidad del profesional.
- El manejo completo de la **historia clínica** de cada paciente, incluyendo tratamientos realizados, diagnósticos, observaciones y archivos adjuntos (como radiografías).
- La **gestión de odontólogos**, sus especialidades y agendas.
- La administración de un catálogo de **tratamientos** con duración estimada y precio.
- El envío de **notificaciones automáticas** para confirmar turnos y recordar citas.
- La generación de **reportes e indicadores** útiles para el análisis de la actividad del consultorio.

El sistema prioriza la **seguridad**, la **usabilidad** y la **escalabilidad**, brindando una solución digital eficaz para la gestión diaria del consultorio odontológico.

---

## ✅ Requerimientos Funcionales

### 1. Gestión de Usuarios

- Registro y login de pacientes.
- Login de odontólogos y del administrador.
- Recuperación de contraseña.
- Roles: paciente, odontólogo y administrador, cada uno con diferentes permisos.

### 2. Gestión de Turnos

- El paciente puede solicitar turnos indicando fecha, hora, especialidad y odontólogo (opcional).
- El sistema muestra disponibilidad en función del calendario del profesional.
- El paciente puede ver, cancelar o reprogramar sus turnos.
- El odontólogo puede aprobar, rechazar o modificar turnos.
- El administrador puede gestionar todos los turnos.

### 3. Gestión de Historia Clínica

- El odontólogo puede crear, editar y consultar la historia clínica de un paciente.
- Las historias clínicas pueden incluir: motivo de consulta, diagnóstico, tratamiento realizado, observaciones y archivos adjuntos (radiografías, etc.).
- Solo el odontólogo asignado o el administrador puede ver la historia clínica.

### 4. Gestión de Odontólogos

- Alta, baja y modificación de odontólogos (nombre, especialidad, horarios disponibles, etc.).
- Visualización de su agenda de turnos.
- Asignación de pacientes y control de historial.

### 5. Gestión de Tratamientos

- Crear y modificar un catálogo de tratamientos (limpieza, ortodoncia, extracciones, etc.).
- Asociar tratamientos a las historias clínicas.
- Visualización de precios y duración estimada.

### 6. Notificaciones

- Envío automático de recordatorios de turnos por correo electrónico o notificación en pantalla.
- Notificación al odontólogo cuando se asigna un nuevo turno o se cancela.

### 7. Reportes (solo para administrador)

- Informe de turnos por fechas.
- Reporte de pacientes atendidos.
- Estadísticas de tratamientos más realizados.

---

## 🚫 Requerimientos No Funcionales

### 1. Usabilidad

- Interfaz accesible y clara para pacientes y personal médico.
- Compatible con dispositivos móviles y tablets (responsive).

### 2. Seguridad

- Acceso a la historia clínica solo por parte de usuarios autorizados.
- Cifrado de contraseñas y uso de JWT o sesión segura.
- Protección contra ataques (XSS, CSRF, SQL Injection si hay backend).

### 3. Mantenibilidad

- Uso de Angular con componentes reutilizables y servicios centralizados.
- Arquitectura limpia (por ejemplo, por módulos).

### 4. Rendimiento

- Carga inicial rápida (segundos).
- Navegación fluida entre páginas.

### 5. Escalabilidad

- Posibilidad de agregar funcionalidades nuevas como facturación, sistema de recetas electrónicas o pagos online.

### 6. Disponibilidad

- Alta disponibilidad del sistema para reservas en línea 24/7.
- Mecanismos para manejo de errores y caídas del servidor.

---

## 📁 Estructura del Proyecto

```plaintext
├── 📂consultorio-odontologico/
    ├── README.md
    ├── package.json
    ├── .gitignore
    ├── 📂backend/
    │   ├── package.json
    │   ├── 📂src/
    │   │   ├── 📁config/
    │   │   ├── 📁controllers/
    │   │   ├── 📁models/
    │   │   ├── 📁routes/
    │   │   ├── 📁middlewares/
    │   │   ├── 📁services/
    │   │   ├── 📁utils/
    │   │   └── index.js
    │   └── .env
    ├── frontend/
    │   ├── angular.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── 📂src/
    │   │ ├── 📂app/
    │   │ │   ├── 📁core/
    │   │ │   ├── 📁shared/
    │   │ │   ├── 📁pages/
    │   │ │   ├── 📁components/
    │   │ │   └── app.module.ts
    │   │ └── 📁assets/
    │   └── 📁environments/
    └── 📂docker/
        ├── docker-compose.yml # Para levantar backend, frontend, y DB
        ├── backend.Dockerfile
        └── frontend.Dockerfile
```

---

## 🗃️ Modelo de Base de Datos

### 1. `usuarios` (pacientes, odontólogos, administrador)

| Campo          | Tipo        | Detalles                            |
| -------------- | ----------- | ----------------------------------- |
| id             | INT (PK)    | AUTO_INCREMENT                      |
| nombre         | VARCHAR(50) | NOT NULL                            |
| apellido       | VARCHAR(50) | NOT NULL                            |
| email          | VARCHAR(50) | UNIQUE, NOT NULL                    |
| contraseña     | VARCHAR(50) | Encriptada                          |
| rol            | ENUM        | ('paciente', 'odontologo', 'admin') |
| telefono       | VARCHAR(20) |                                     |
| fecha_registro | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP           |

---

### 2. `odontologos`

| Campo        | Tipo        | Detalles                    |
| ------------ | ----------- | --------------------------- |
| id           | INT (PK)    | AUTO_INCREMENT              |
| usuario_id   | INT (FK)    | Referencia a `usuarios(id)` |
| especialidad | VARCHAR(50) | Ej: Ortodoncia, Endodoncia  |

---

### 3. `pacientes`

| Campo            | Tipo         | Detalles                    |
| ---------------- | ------------ | --------------------------- |
| id               | INT (PK)     | AUTO_INCREMENT              |
| usuario_id       | INT (FK)     | Referencia a `usuarios(id)` |
| ci               | VARCHAR(20)  | ÚNICO                       |
| fecha_nacimiento | DATE         |                             |
| direccion        | VARCHAR(100) |                             |

---

### 4. `turnos`

| Campo         | Tipo     | Detalles                                             |
| ------------- | -------- | ---------------------------------------------------- |
| id            | INT (PK) | AUTO_INCREMENT                                       |
| paciente_id   | INT (FK) | Referencia a `pacientes(id)`                         |
| odontologo_id | INT (FK) | Referencia a `odontologos(id)`                       |
| fecha         | DATE     |                                                      |
| hora          | TIME     |                                                      |
| estado        | ENUM     | ('pendiente', 'confirmado', 'cancelado', 'atendido') |
| comentario    | TEXT     |                                                      |

---

### 5. `historia_clinica`

| Campo                 | Tipo     | Detalles                       |
| --------------------- | -------- | ------------------------------ |
| id                    | INT (PK) | AUTO_INCREMENT                 |
| paciente_id           | INT (FK) | Referencia a `pacientes(id)`   |
| odontologo_id         | INT (FK) | Referencia a `odontologos(id)` |
| fecha                 | DATETIME | DEFAULT CURRENT_TIMESTAMP      |
| diagnostico           | TEXT     |                                |
| tratamiento_realizado | TEXT     |                                |
| observaciones         | TEXT     |                                |

---

### 6. `tratamientos`

| Campo             | Tipo          | Detalles            |
| ----------------- | ------------- | ------------------- |
| id                | INT (PK)      | AUTO_INCREMENT      |
| nombre            | VARCHAR(100)  | Ej: Limpieza dental |
| descripcion       | TEXT          |                     |
| precio            | DECIMAL(10,2) |                     |
| duracion_estimada | INT           | En minutos          |

---

### 7. `historia_tratamientos`

(relación muchos a muchos entre historia clínica y tratamientos)

| Campo          | Tipo     | Detalles                                   |
| -------------- | -------- | ------------------------------------------ |
| historia_id    | INT (FK) | Referencia a `historia_clinica(id)`        |
| tratamiento_id | INT (FK) | Referencia a `tratamientos(id)`            |
| cantidad       | INT      | Opcional, útil para tratamientos repetidos |

**Clave primaria compuesta:** `(historia_id, tratamiento_id)`

---

### 8. `archivos_adjuntos`

| Campo        | Tipo        | Detalles                              |
| ------------ | ----------- | ------------------------------------- |
| id           | INT (PK)    | AUTO_INCREMENT                        |
| historia_id  | INT (FK)    | Referencia a `historia_clinica(id)`   |
| archivo_url  | TEXT        | Ruta del archivo (S3, Firebase, etc.) |
| tipo_archivo | VARCHAR(50) | Ej: radiografía, receta, etc.         |
| fecha_subida | DATETIME    |                                       |
