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