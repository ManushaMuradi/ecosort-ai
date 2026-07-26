# EcoSort - Smart Waste Management System

## Overview

EcoSort is a full-stack waste management platform designed to streamline the process of waste collection and management. The system enables citizens to submit waste collection requests, upload waste images, track request status, and communicate efficiently with municipal authorities. Municipal administrators and waste collectors can manage requests, update collection statuses, and monitor waste management activities through dedicated dashboards.

The project aims to improve urban cleanliness, enhance waste collection efficiency, and provide transparency between citizens and waste management authorities.

## Features

### Citizen Features

* User registration and secure login
* Submit waste collection requests
* Upload waste images
* Track request status in real time
* View request history
* Profile management

### Municipal Administrator Features

* Manage users and waste requests
* Assign requests to collectors
* Update request statuses
* Monitor waste collection activities
* Dashboard with system statistics

### Waste Collector Features

* View assigned waste collection requests
* Update collection progress
* Mark requests as completed
* Manage collection schedules

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* REST APIs
* Maven

### Database

* PostgreSQL

### Deployment

* Vercel (Frontend)
* Render(Backend)
* Neon PostgreSQL(Database)

## System Architecture

The application follows a client-server architecture:

1. Frontend built using Next.js communicates with backend REST APIs.
2. Spring Boot backend handles business logic and authentication.
3. PostgreSQL stores user, waste request, and system data.
4. JWT-based authentication secures API access.
5. Role-based access control supports Citizens, Municipal Administrators, and Waste Collectors.

## User Roles

### Citizen

* Create and manage waste requests
* Track collection progress
* Upload waste-related images

### Municipal Admin

* Manage all waste requests
* Assign collectors
* Monitor system operations

### Collector

* Process assigned requests
* Update collection status
* Complete waste collection tasks

## Database Modules

* Users
* Waste Requests
* Waste Categories
* Request Assignments
* Collection Status Tracking
* Notifications

## Security Features

* JWT Authentication
* Password Encryption
* Role-Based Authorization
* Secure API Access
* Protected Routes

## Future Enhancements

* AI-based waste classification
* Route optimization for collectors
* Mobile application support
* Email and SMS notifications
* Analytics and reporting dashboard
* Integration with smart city services

## Project Outcome

EcoSort provides an efficient and transparent waste management solution by connecting citizens, municipal authorities, and waste collectors through a centralized digital platform. The system reduces manual processes, improves operational efficiency, and promotes cleaner communities.

## Author

Manusha Muradi

## Live Demo

[View Source Code][ecosort-ai-np2g.vercel.app]

## GitHub Repository

[Launch EcoSort][https://github.com/ManushaMuradi/ecosort-ai]
