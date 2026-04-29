# Hidromiel Calculator

This is a full-stack web application designed to help homebrewers calculate and manage recipes for mead (hidromiel) and wine. It features user authentication, recipe management, and specialized calculators.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development (Manual)](#local-development-manual)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Improvements Implemented](#improvements-implemented)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Register, Login, Logout)
- Mead Calculator
- Wine Calculator
- Recipe Management (Create, View, Update, Delete)
- Fermentation Tracking (Planned/Future)
- Responsive UI for various devices

## Technologies Used

### Backend
- **Django**: Web framework for rapid development.
- **Django Rest Framework (DRF)**: Toolkit for building Web APIs.
- **djangorestframework-simplejwt**: JWT (JSON Web Token) based authentication.
- **drf-yasg**: Automated API documentation (Swagger/OpenAPI).
- **Python 3.10**

### Frontend
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Vite**: Fast frontend build tool.
- **HTML5, CSS3**

### Other
- **GitHub Actions**: For Continuous Integration (CI).

## Getting Started

### Prerequisites

- Node.js (v20 or higher) and npm.
- Python 3.10 and pip.

### Local Development (Manual)

#### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    ```bash
    python3.10 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create backend environment file:**
    ```bash
    cp .env.example .env # (If .env.example exists, otherwise create .env manually)
    # Edit .env with your SECRET_KEY and other settings
    ```
    *Note: A basic `.env` file has been created for you in `backend/.env`.*

5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Create a superuser (optional):**
    ```bash
    python manage.py createsuperuser
    ```

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000/api/`.

#### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## API Documentation

The backend API documentation is automatically generated using `drf-yasg`.
-   **Swagger UI:** `http://localhost:8000/swagger/`
-   **ReDoc:** `http://localhost:8000/redoc/`

## Project Structure

```
.
├── backend/                  # Django Backend
│   ├── api/                  # API application (models, views, serializers, tests)
│   ├── hidromiel_backend/    # Main Django project settings
│   ├── venv/                 # Python Virtual Environment
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/                  # React source code (components, context, services, utils)
│   ├── package.json          # Node.js dependencies
│   └── ...
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       ├── backend_ci.yml    # CI for backend
│       └── frontend_ci.yml   # CI for frontend
└── README.md                 # Project README (this file)
```

## Improvements Implemented

During the development process, the following improvements were implemented:

-   **API Documentation:** Integrated `drf-yasg` for Swagger/ReDoc documentation, making the API easier to understand and consume.
-   **Backend Unit Testing:** Added a basic unit test for `RecetaListCreateView` to ensure core functionality and prevent regressions.
-   **Error Handling (Backend):** Configured a custom exception handler for Django Rest Framework to provide consistent and informative error responses.
-   **Frontend UI/UX & Responsiveness (Accessibility):** Enhanced accessibility by adding ARIA attributes (`role="alert"`, `aria-live="assertive"`) to error messages in the `Auth` component.
-   **Frontend Performance Optimization:** Implemented lazy loading for key components (`MeadCalculator`, `WineCalculator`, `RecipeList`) in `App.tsx` to reduce initial bundle size and improve load times.
-   **Backend Security (Rate Limiting):** Configured default rate limiting for DRF views to protect against abuse and brute-force attacks.
-   **CI/CD (Backend & Frontend):** Set up basic GitHub Actions workflows for automated testing (backend) and build processes (frontend) on code pushes and pull requests.

## Credenciales de Acceso

- **Usuario:** `admin`
- **Contraseña:** `admin`

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT License]# Hidromiel Calculator

Proyecto limpio y funcional.
