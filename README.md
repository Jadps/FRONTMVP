# SaaS MVP Frontend (Panel de Control)

Aplicación Single Page Application (SPA) para la gestión del MVP SaaS. Diseñada para consumir la API REST del backend con un enfoque en la velocidad y la experiencia de usuario.

🚀 **Demo en Vivo:** [https://frontmvp-ashy.vercel.app](https://frontmvp-ashy.vercel.app)

## ⚙️ Stack Tecnológico

* **Framework:** Angular 
* **Lenguaje:** TypeScript
* **UI / Componentes:** PrimeNG / PrimeIcons (implícito en el diseño)
* **Autenticación:** Interceptores de JWT y protección de rutas mediante Guards
* **Infraestructura/Despliegue:** Vercel (con `vercel.json` configurado para enrutamiento SPA)

## 🚀 Características Principales

* **Autenticación Segura:** Login interactivo manejando tokens JWT y mitigación CORS/CSRF.
* **Dashboard Dinámico:** Interfaz principal para visualizar métricas, crecimiento y estado de seguridad.
* **Soporte Multi-Tenant:** Arquitectura preparada para manejar datos aislados por empresa.
* **Gestión de Accesos:** Sistema de roles y módulos basado en la respuesta del backend.

## 🛠️ Instalación y Configuración Local

### Requisitos Previos
* [Node.js](https://nodejs.org/) (LTS recomendado)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Ejecución

1. Clona el repositorio: `git clone https://github.com/Jadps/FRONTMVP.git`
2. Instala las dependencias: `npm install`
3. Configura el entorno:
   Verifica que el archivo `src/environments/environment.ts` apunte a tu API local (ej. `https://localhost:44329/api/v1.0`).
4. Inicia el servidor de desarrollo: `ng serve -o`

La aplicación se abrirá automáticamente en `http://localhost:4200/`.

## 📦 Despliegue a Producción

El proyecto está optimizado para desplegarse en plataformas como Vercel o Netlify. 
Asegúrate de que el archivo `src/environments/environment.prod.ts` contenga la URL de tu API en producción antes de ejecutar el comando de construcción:

```bash
ng build