# Coconut E-commerce Prototype

This project serves as a demonstration of a basic e-commerce server-side application, showcasing fundamental features like managing products, 
warehouses, stocks, and orders.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js:** Make sure you have Node.js installed. You can download and install it from [https://nodejs.org/](https://nodejs.org/)
- **npm:** npm is a package manager that comes with Node.js. It is used to install project dependencies. To check if you have npm installed, run the following command in your terminal: `npm -v`
- **PostgreSQL:** Make sure you have PostgreSQL installed. You can download and install it from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

## Setup
1. Clone this repository to your local machine using `git clone https://github.com/hizas-code/coconut-ecommerce-prototype.git`.
2. Install AdonisJS v4 globally using `npm i -g @adonisjs/cli`.
3. Go to the project directory and install the required dependencies using `npm install`.
4. Setup your PostgreSQL database connection in the .env file.
5. Run database migration using `adonis migration:run`.
6. Run the app using `adonis serve --dev`

## Testing
[Postman](https://www.postman.com/) is a powerful tool for testing APIs. You can use Postman to interact with the API endpoints of this application and verify their functionality.
1. Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2. Open Postman and click on the "Import" button. Choose the provided Postman collection file `Coconut.postman_collection.json` from the `postman` directory in this repository.
3. Set up postman environment and define the necessary variables (`url` and `token`).
4. You can now run individual API requests from the Postman collection. 

## Version Information
This is list of the tools and technologies used to build this app, along with their respective versions.
- Node.js (version 12.14.1)
- npm (version 6.13.4)
- AdonisJS (version 4.1.0)
- PostgreSQL (version 12.8)
- Postman (version 9.31.27)