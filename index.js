import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

// API Configuration
const RANDOM_USER_API = 'https://randomuser.me/api/'
const COUNTRY_API_KEY = process.env.COUNTRY_API_KEY
const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY
const COUNTRYLAYER_API = 'https://api.countrylayer.com/v2/all'
const EXCHANGERATE_API = 'https://v6.exchangerate-api.com/v6'

// Fallback data for demo purposes
const fallbackCountries = {
    'United States': { name: 'United States', capital: 'Washington, D.C.', languages: 'English', currencyCode: 'USD', currencyName: 'US Dollar', flag: 'https://flagcdn.com/us.svg' },
    'United Kingdom': { name: 'United Kingdom', capital: 'London', languages: 'English', currencyCode: 'GBP', currencyName: 'British Pound', flag: 'https://flagcdn.com/gb.svg' },
    'Canada': { name: 'Canada', capital: 'Ottawa', languages: 'English, French', currencyCode: 'CAD', currencyName: 'Canadian Dollar', flag: 'https://flagcdn.com/ca.svg' },
    'Australia': { name: 'Australia', capital: 'Canberra', languages: 'English', currencyCode: 'AUD', currencyName: 'Australian Dollar', flag: 'https://flagcdn.com/au.svg' },
    'France': { name: 'France', capital: 'Paris', languages: 'French', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/fr.svg' }
}

const countries = {
    'United States': { name: 'United States', capital: 'Washington, D.C.', languages: 'English', currencyCode: 'USD', currencyName: 'US Dollar', flag: 'https://flagcdn.com/us.svg' },
    'United Kingdom': { name: 'United Kingdom', capital: 'London', languages: 'English', currencyCode: 'GBP', currencyName: 'British Pound', flag: 'https://flagcdn.com/gb.svg' },
    'Canada': { name: 'Canada', capital: 'Ottawa', languages: 'English, French', currencyCode: 'CAD', currencyName: 'Canadian Dollar', flag: 'https://flagcdn.com/ca.svg' },
    'Australia': { name: 'Australia', capital: 'Canberra', languages: 'English', currencyCode: 'AUD', currencyName: 'Australian Dollar', flag: 'https://flagcdn.com/au.svg' },
    'France': { name: 'France', capital: 'Paris', languages: 'French', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/fr.svg' },
    'Germany': { name: 'Germany', capital: 'Berlin', languages: 'German', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/de.svg' },
    'Spain': { name: 'Spain', capital: 'Madrid', languages: 'Spanish', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/es.svg' },
    'Italy': { name: 'Italy', capital: 'Rome', languages: 'Italian', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/it.svg' },
    'Netherlands': { name: 'Netherlands', capital: 'Amsterdam', languages: 'Dutch', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/nl.svg' },
    'Mexico': { name: 'Mexico', capital: 'Mexico City', languages: 'Spanish', currencyCode: 'MXN', currencyName: 'Mexican Peso', flag: 'https://flagcdn.com/mx.svg' },
    'Brazil': { name: 'Brazil', capital: 'Brasília', languages: 'Portuguese', currencyCode: 'BRL', currencyName: 'Brazilian Real', flag: 'https://flagcdn.com/br.svg' },
    'India': { name: 'India', capital: 'New Delhi', languages: 'Hindi', currencyCode: 'INR', currencyName: 'Indian Rupee', flag: 'https://flagcdn.com/in.svg' },
    'Japan': { name: 'Japan', capital: 'Tokyo', languages: 'Japanese', currencyCode: 'JPY', currencyName: 'Japanese Yen', flag: 'https://flagcdn.com/jp.svg' },
    'China': { name: 'China', capital: 'Beijing', languages: 'Chinese', currencyCode: 'CNY', currencyName: 'Chinese Yuan', flag: 'https://flagcdn.com/cn.svg' },
    'Russia': { name: 'Russia', capital: 'Moscow', languages: 'Russian', currencyCode: 'RUB', currencyName: 'Russian Ruble', flag: 'https://flagcdn.com/ru.svg' },
    'New Zealand': { name: 'New Zealand', capital: 'Wellington', languages: 'English', currencyCode: 'NZD', currencyName: 'New Zealand Dollar', flag: 'https://flagcdn.com/nz.svg' },
    'Ireland': { name: 'Ireland', capital: 'Dublin', languages: 'English', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/ie.svg' },
    'Ukraine': { name: 'Ukraine', capital: 'Kyiv', languages: 'Ukrainian', currencyCode: 'UAH', currencyName: 'Ukrainian Hryvnia', flag: 'https://flagcdn.com/ua.svg' },
    'Turkey': { name: 'Turkey', capital: 'Ankara', languages: 'Turkish', currencyCode: 'TRY', currencyName: 'Turkish Lira', flag: 'https://flagcdn.com/tr.svg' },
    'Greece': { name: 'Greece', capital: 'Athens', languages: 'Greek', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/gr.svg' }
}

const rates = {
    'USD': { baseCurrency: 'USD', toUSD: '1.00', toKZT: '475.50' },
    'EUR': { baseCurrency: 'EUR', toUSD: '1.08', toKZT: '514.50' },
    'GBP': { baseCurrency: 'GBP', toUSD: '1.27', toKZT: '603.89' },
    'CAD': { baseCurrency: 'CAD', toUSD: '0.71', toKZT: '337.41' },
    'AUD': { baseCurrency: 'AUD', toUSD: '0.65', toKZT: '309.08' },
    'MXN': { baseCurrency: 'MXN', toUSD: '0.058', toKZT: '27.55' },
    'BRL': { baseCurrency: 'BRL', toUSD: '0.20', toKZT: '95.10' },
    'INR': { baseCurrency: 'INR', toUSD: '0.0118', toKZT: '5.61' },
    'JPY': { baseCurrency: 'JPY', toUSD: '0.0064', toKZT: '3.04' },
    'CNY': { baseCurrency: 'CNY', toUSD: '0.137', toKZT: '65.13' },
    'RUB': { baseCurrency: 'RUB', toUSD: '0.011', toKZT: '5.23' },
    'NZD': { baseCurrency: 'NZD', toUSD: '0.59', toKZT: '280.50' },
    'UAH': { baseCurrency: 'UAH', toUSD: '0.025', toKZT: '11.88' },
    'TRY': { baseCurrency: 'TRY', toUSD: '0.031', toKZT: '14.75' }
}

function getAge(dob) {
    const [year, month, day] = dob.split('-').map(Number)
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()
    
    let age = currentYear - year
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
        age--
    }
    return age
}

async function fetchRandomUser() {
    try {
        const response = await fetch(RANDOM_USER_API)
        const data = await response.json()
        if (data.results && data.results.length > 0) {
            const user = data.results[0]
            return {
                firstName: user.name.first,
                lastName: user.name.last,
                gender: user.gender,
                dob: user.dob.date.split('T')[0],
                city: user.location.city,
                country: user.location.country,
                address: user.location.street.name,
                email: user.email,
                phone: user.phone,
                nationality: user.nat,
                picture: user.picture.large
            }
        }
    } catch (error) {
        console.error('Error fetching random user:', error.message)
    }
    return null
}

async function fetchCountryData(countryName) {
    try {
        if (COUNTRY_API_KEY && COUNTRY_API_KEY !== 'your_countrylayer_api_key_here') {
            const response = await fetch(`${COUNTRYLAYER_API}?access_key=${COUNTRY_API_KEY}`)
            const data = await response.json()
            
            if (data && Array.isArray(data)) {
                const country = data.find(c => c.name.toLowerCase() === countryName.toLowerCase())
                if (country) {
                    return {
                        name: country.name,
                        capital: country.capital || 'N/A',
                        languages: country.languages ? country.languages.map(l => l.name).join(', ') : 'N/A',
                        currencyCode: country.currencies ? country.currencies[0].code : 'USD',
                        currencyName: country.currencies ? country.currencies[0].name : 'US Dollar',
                        flag: `https://flagcdn.com/${country.alpha2Code?.toLowerCase()}.svg`
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching country data:', error.message)
    }
    
    // Fallback to local data
    return countries[countryName] || countries['United States']
}

async function fetchExchangeRates(baseCurrency) {
    try {
        if (EXCHANGE_API_KEY && EXCHANGE_API_KEY !== 'your_exchangerate_api_key_here') {
            const response = await fetch(`${EXCHANGERATE_API}/${EXCHANGE_API_KEY}/latest/${baseCurrency}`)
            const data = await response.json()
            if (data && data.conversion_rates) {
                return {
                    baseCurrency: baseCurrency,
                    toUSD: data.conversion_rates.USD?.toFixed(4) || 'N/A',
                    toKZT: data.conversion_rates.KZT?.toFixed(2) || 'N/A'
                }
            }
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message)
    }
    // Fallback to global rates object
    return rates[baseCurrency] || rates['USD']
}

app.get('/api/user', async (req, res) => {
    try {
        const person = await fetchRandomUser()
        if (!person) {
            return res.status(500).json({ success: false, error: 'Failed to fetch user data' })
        }
        
        console.log(`📍 User country: ${person.country}`)
        
        // Fetch real country data
        const country = await fetchCountryData(person.country)
        console.log(`🌍 Country data: ${country.name} (${country.currencyCode})`)
        
        // Fetch real exchange rates
        const exchange = await fetchExchangeRates(country.currencyCode)
        console.log(`💱 Exchange rates: 1 ${exchange.baseCurrency} = ${exchange.toUSD} USD = ${exchange.toKZT} KZT`)
        
        const userData = {
            ...person,
            age: getAge(person.dob),
            dob: new Date(person.dob).toLocaleDateString('en-US')
        }
        
        console.log(`✅ Response: ${userData.firstName} ${userData.lastName}, ${userData.age} years old from ${userData.country}`)
        
        // Demo news data
        const news = [
            { title: 'US Economy Grows Fastest Pace in Two Years', description: 'Strong consumer spending boosts economy', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop', source: 'BBC Business', publishedAt: '12/24/2025' },
            { title: 'Meta Implements Linux Scheduler', description: 'Infrastructure improvements at Meta', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop', source: 'Tech News', publishedAt: '12/24/2025' },
            { title: 'Ultrasound Technology in Cancer Treatment', description: 'Sound waves show promise fighting tumors', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop', source: 'Medical Science', publishedAt: '12/23/2025' }
        ]
        
        res.json({
            success: true,
            user: userData,
            country,
            exchange,
            news
        })
    } catch (error) {
        console.error('Error in /api/user:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', port: PORT })
})

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`)
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/user\n`)
})
