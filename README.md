# Book store API using NodeJS

RESTful API for managing a collection of books. The API allows users to add books, view a list of books, update
information about books and delete books. The API has functions for
managing users and their roles using bit masks.

## Tech Stack
- ExpressJS
- MongoDB

## How to install
First of all you need to install **NPM** and **Docker**

- git clone https://github.com/ArtyomSukiasyan/books-api.git
- cd books-api
- create **.env** file, you can take example from **.env.example**
- npm i
- make dev (or **docker-compose -f docker-compose.dev.yml up -d** if you don't have Make)
- npm start

Application uses port 5000 by default

Mongo admin uses port 8081 by default

## Creating admin
By default at first run application will create user with `admin` role. Credentials is in **.env.example** fle

## Project API Documentation

### 1. Adding a Book
- **HTTP Method:** POST
- **Endpoint:** /books
- **Request Body:** JSON with fields `title`, `author`, `publicationDate`, `genres`
- **Response:** JSON with the data of the added book
- **Authentication Required:** Yes (Admin role only)

### 2. Getting the List of Books
- **HTTP Method:** GET
- **Endpoint:** /books
- **Response:** JSON array with the data of all books

### 3. Getting a Book by ID
- **HTTP Method:** GET
- **Endpoint:** /books/:id
- **Response:** JSON with the data of the specified book

### 4. Updating Book Information
- **HTTP Method:** PUT
- **Endpoint:** /books/:id
- **Request Body:** JSON with fields `title`, `author`, `publicationDate`, `genres`
- **Response:** JSON with the data of the updated book
- **Authentication Required:** Yes (Admin role only)

### 5. Deleting a Book
- **HTTP Method:** DELETE
- **Endpoint:** /books/:id
- **Authentication Required:** Yes (Admin role only)

### 6. User Registration
- **HTTP Method:** POST
- **Endpoint:** /users/register
- **Request Body:** JSON with fields `username`, `password`, `email`
- **Email Confirmation:** Via email
- **Response:** JSON with the data of the registered user

### 7. User Authentication
- **HTTP Method:** POST
- **Endpoint:** /users/login
- **Request Body:** JSON with fields `username`, `password`
- **Response:** JSON with JWT token

### 8. Getting Current User Information
- **HTTP Method:** GET
- **Endpoint:** /users/me
- **Response:** JSON with the data of the current user
- **Authentication Required:** Yes

### 9. Changing User Role
- **HTTP Method:** PUT
- **Endpoint:** /users/:id/role
- **Request Body:** JSON with field `role` (use bitmasks for roles)
- **Response:** JSON with the data of the updated user
- **Authentication Required:** Yes (Admin role only)
