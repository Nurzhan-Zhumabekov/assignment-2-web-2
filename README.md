🌍 Global Explorer
Description

Global Explorer is a simple web application built with Node.js and Express.
It uses public APIs to generate a random user, display country information, and show the exchange rate of the country’s currency in USD and KZT.

Features

Random user generation

Country information (capital, language, flag)

National currency for each country

Exchange rates:

1 local currency → USD

1 local currency → KZT

Support for multiple countries and currencies

Technologies

Node.js

Express.js

JavaScript

HTML & CSS

REST APIs

APIs Used

Random User API — https://randomuser.me

CountryLayer API — https://countrylayer.com

ExchangeRate API — https://www.exchangerate-api.com

Project Structure
/public
  index.html
  style.css
index.js
.env
package.json
README.md

Setup

Create a .env file:

COUNTRY_API_KEY=your_countrylayer_key
EXCHANGE_API_KEY=your_exchangerate_key
PORT=3000
Run
npm install
node index.js


Open in browser:

http://localhost:3000

Example
Currency: EUR
1 EUR = 1.08 USD
1 EUR = 495.20 KZT

Conclusion

This project demonstrates basic backend development, API integration, and exchange rate handling using Node.js and Express.