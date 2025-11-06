# Task-Manager

A full-stack web application for project and task management, built with FastAPI, React, and AWS. Features secure JWT authentication, role-based access control, and a clean, responsive UI.
**Web Address:** [**https://steady-blini-d7510d.netlify.app**](https://steady-blini-d7510d.netlify.app) - not active

### Dummy Credentials
* **User:**
    * **Login:** `User`
    * **Password:** `qwerty1234`
* **Manager:**
    * **Login:** `managerUser`
    * **Password:** `DjYTS5rpp3EUSKs`
* **Admin:**
    * **Login:** `adminUser`
    * **Password:** `DjYTS5rpp3EUSK`

## Motivation behind the project

This project originated from a practical need identified during a series of collaborative AI development activities undertaken in the summer with other students. The project team found that existing project management tools were often too complex or unsuited to small, technically focused groups.
To address this issue, I decided to design a lightweight, custom task management system to support efficient collaboration and progress tracking. The system emphasizes:
•	Full visibility of all projects and tasks for all team members
•	Clear accountability by allowing users to update only their assigned tasks
•	Simple project and task management features for coordinators or team leads

## Project Overview
The Task Manager is a full-stack web application designed to streamline project and task management. It provides role-based access control, secure authentication, and intuitive interface for managing tasks and projects. The system was built with a custom FastAPI backend written in Python that was deployed on AWS EC2 and connected to a Microsoft SQL Server database on AWS RDS, and a React frontend deployed on Netlify.


## Features

* **Secure Authentication:** Full user registration, login, and password reset functionality using **JWT access/refresh tokens** and **Argon2** password hashing.
* **Role-Based Access Control (RBAC):** Three distinct roles with granular permissions:
    * **User:** Can view projects/tasks and complete their *own* assigned tasks.
    * **Manager:** Can create, edit, and delete projects/tasks and assign tasks to users.
    * **Admin:** Can promote existing users to the Manager role.
* **Protected Routes:** Frontend and backend routes are protected, redirecting unauthorized users.
* **Dynamic CRUD Operations:** Create, read, edit, and delete projects and tasks via asynchronous AJAX (Axios) requests without page reloads.
* **Responsive UI:** Aesthetically pleasing and responsive design built with **Tailwind CSS**, adapting seamlessly from desktop to mobile.
* **Form Validation:** Robust client-side and server-side validation for all user inputs using Pydantic and React.
* **Email Service:** Password reset tokens are securely emailed to users via Gmail SMTP.

### Tech Stack

* **Backend:**
    * Framework: **FastAPI (Python)**
    * Authentication: **JWT (passlib, python-jose)**
    * Database ORM: **pyodbc** (for direct SQL)
    * Validation: **Pydantic**
    * Server: **Uvicorn**
* **Frontend:**
    * Framework: **React (Vite)**
    * HTTP Client: **Axios**
    * Routing: **React Router**
    * Styling: **Tailwind CSS**
    * Token Handling: **jwt-decode**
* **Database:**
    * **Microsoft SQL Server (MSSQL)**
* **Deployment:**
    * Backend: **AWS EC2**
    * Database: **AWS RDS**
    * Frontend: **Netlify**
    * Testing: **Pytest, Jest, React Testing Library, Cypress**

---

### System Architecture

The system uses a decoupled, cloud-based architecture. The React frontend is deployed on Netlify, and the FastAPI backend is deployed on an AWS EC2 instance. The backend communicates with a managed Microsoft SQL Server database hosted on AWS RDS.

## Deployment & Integration

The application is fully web-hosted.

* **Backend:** Deployed on **AWS EC2** running FastAPI with Uvicorn. It connects to the **AWS RDS** database via a secure ODBC string stored in environment variables.
* **Frontend:** Deployed on **Netlify**.

To avoid CORS issues and secure the backend API address, a **Netlify proxy redirect** is used. A `_redirects` file in the `public` folder routes all API calls from `/api/*` on the frontend to the AWS EC2 backend server.
