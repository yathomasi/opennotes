# opennotes (backend api)
Note taking app using nodejs, restify & sequlize with authentication and authorizaion using jsonwebtoken.


## Stack
- Nodejs
- Restify
- Sequelize


# Getting Started
To get the Node server running locally:
### Installation
Make sure you have  [Node.js](https://nodejs.org/) and yarn installed. 
Also as we use mysql or mariadb for database which can be installed to your computer and serve easily or use mysql workbench for the database.

Here Nodejs version v10.15.3 is used. You can use NVM to install the exact version. Also yarn v1.21.1 as package dependeny manager

Clone this repo:

 ` git clone https://github.com/yathomasi/opennotes.git `
 

Install the dependencies and devDependencies.

```sh
cd opennotes
yarn install
```
### Database
Create a database with mysql or mariadb and specify the details in `.env` file.

### Manage Environment File

You can create a new `.env` file in root directory and copy`.env.example`content.

OR
Copy the file `.env.example` to `.env` and replace the value in key=value format environment file

### Running the server

Now let's run the server

`yarn start ` for simple nodejs run

`yarn dev` run using nodemon

`yarn debug` debug mode with nodemon

### Endpoints

- get /api/v1/test - test route
- get /api/v1/notes - return all the notes
- get /api/v1/notes/:id - return specific note
- post /api/v1/register - register 
```json
{
	"name" : "name",
	"email" : "user@mail.com",
	"username": "user",
	"password": "pass"
}
```
- post /api/v1/login - login
```json
{
	"email" : "user@mail.com",
	"password": "pass"
}
```
- post /api/v1/notes - add notes (auth required)
```json
{
	"Title":"homework",
	"Content":"math equation science derivation"
}
```
- put /api/v1/notes/:id - update notes (auth required)
```json
{
	"Title":"nowork",
	"Content":"english passage"
}
```
- del /api/v1/notes/:id - delete notes (auth required)

