# Plaster Money Transfer System

This is a simple money transfer system built as part of an interview assessment. It utilizes NestJS as the primary framework, with KnexJS and ObjectionJS for database queries, PostgreSQL as the database, and Redis for caching.

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)
  - [Database Configuration](#database-configuration)
  - [Caching Setup](#caching-setup)
- [Running the Application](#running-the-application)



## Introduction

Plaster is a lightweight money transfer system designed to facilitate secure and efficient financial transactions between users. Built with NestJS, this application provides a robust foundation for handling various financial operations.

## Features

- User registration and authentication
- Money transfer between users
- Secure data storage using PostgreSQL
- Caching mechanism for improved performance (Redis)
- Comprehensive API documentation (Swagger ft Postman)

## Requirements

- Nodejs 18 or later
- Postgres 15 or later (a docker image or native installation is fine)
- Nestjs (install [here](https://docs.nestjs.com/first-steps))
- Redis 

## Setup and Installation

To set up and run this application, follow these steps:

1. Clone the repository:

```bash
  git clone https://github.com/Richd0tcom/glowing-lamp.git && cd glowing-lamp
```
2. Install dependencies:

```bash
  npm install
```

3. Set up environment variables (see [below](#environment-variables) for details).

4. Run migrations

```bash
  npm run migrateup
```
N/B run `npm run seed` to create two readily available test users locally.

5. Run the application:

```bash
  npm start
```


## API Documentation

The API documentation is available at:
[this place on the internet](https://documenter.getpostman.com/view/22009828/2sAXxY38ac#8de1f09e-27ed-4c71-92a6-6afd3da36eb0)

This documentation provides detailed information about all endpoints, request/response formats, and available parameters.

## Endpoints

A Postman collection containing all the implemented endpoints can be found in the submission email

## Environment Variables

Create a `.env` file (you can also rename the `.env.example` file) in the root directory of your project and add the following variables:

```env
  DB_DATABASE=
  DB_USER=
  DB_PASSWORD=
  DB_PORT=
  NODE_ENV=
  JWT_SECRET="CIA LEVEL SECRET"
  REDIS_PORT=
  REDIS_HOST=

```

Replace the values with your actual database and Redis connection details.

### Database Configuration

This application uses KnexJS with ObjectionJS for database interactions. The configuration is stored in `knexfile.js`. Make sure to update the `DB_` values in the `.env` file to match your PostgreSQL instance.

### Caching Setup

Update the `REDIS_HOST` and `REDIS_PORT` in the `.env` file if you're using a remote Redis server.

