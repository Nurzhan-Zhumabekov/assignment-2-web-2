# Global Explorer

Web application for viewing information about random users and their countries with integration of 4 APIs.

## Features

1. Random User - name, gender, age, date of birth, city, country, address, photo
2. Country Information - name, capital, languages, currency, flag (CountryLayer API)
3. Exchange Rates - conversion to USD and KZT (ExchangeRate API, fallback to global rates object)
4. News - 5 news articles by country (NewsAPI)

## Technologies

- Backend: Node.js, Express.js
- Frontend: HTML5, CSS3, JavaScript
- APIs: RandomUser, CountryLayer, ExchangeRate, NewsAPI

## Project Structure

```
project/
├── index.js          # Server with API integration
├── package.json      # Dependencies
├── .env             # API keys (confidential)
├── .gitignore       # Git rules
├── README.md        # This file
└── public/
    └── index.html   # Frontend application
```

## Installation and Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Keys (Free)

- CountryLayer: https://manage.countrylayer.com/signup/free
- ExchangeRate: https://www.exchangerate-api.com/
- NewsAPI: https://newsapi.org/

### 3. Configure .env File

```env
COUNTRY_API_KEY=your_key
EXCHANGE_API_KEY=your_key
NEWS_API_KEY=your_key
PORT=3000
NODE_ENV=development
```

### 4. Start Server

```bash
npm start
```

Open in browser: http://localhost:3000

Click "Get Random User" button to start.

## API Endpoints

GET /api/user - Get user, country, exchange rates and news data

Response:
```json
{
  "success": true,
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "gender": "male",
    "age": 28,
    "dob": "1995-06-15",
    "city": "London",
    "country": "United Kingdom",
    "address": "123 Main Street, 42",
    "picture": "https://..."
  },
  "country": {
    "name": "United Kingdom",
    "capital": "London",
    "languages": "English",
    "currencyCode": "GBP",
    "currencyName": "British Pound",
    "flag": "https://..."
  },
  "exchange": {
    "baseCurrency": "GBP",
    "toUSD": "1.27",
    "toKZT": "543.20"
  },
  "news": [
    {
      "title": "Article Title",
      "description": "Article description...",
      "image": "https://...",
      "url": "https://...",
      "source": "BBC News",
      "publishedAt": "12/23/2025"
    }
  ]
}
```

GET /api/health - Server status check

## User Interface

- Modern responsive design
- Card-based layout
- Data loading animation
- Error handling
- Mobile-friendly
- Image support
- Article links

## Security

- API keys stored in .env
- .env added to .gitignore
- Data validation
- Error handling

## Key Features

- Asynchronous operations (async/await)
- JSDoc code documentation
- Error handling
- Image loading
- Links to full articles
- Fallback currency rates are provided from a global rates object if API is unavailable

## Troubleshooting

If COUNTRY_API_KEY not found error appears:
- Check .env file exists in root directory
- Verify API key is correct
- Restart the server

If server won't start on port 3000:
- Check if port 3000 is already in use
- Change PORT value in .env file

Explore the world!
