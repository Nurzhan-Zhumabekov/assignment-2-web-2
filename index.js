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

const RANDOM_USER_API = 'https://randomuser.me/api/'

const countries = {
    'United States': { name: 'United States', capital: 'Washington, D.C.', languages: 'English', currencyCode: 'USD', currencyName: 'US Dollar', flag: 'https://flagcdn.com/us.svg' },
    'United Kingdom': { name: 'United Kingdom', capital: 'London', languages: 'English', currencyCode: 'GBP', currencyName: 'British Pound', flag: 'https://flagcdn.com/gb.svg' },
    'Canada': { name: 'Canada', capital: 'Ottawa', languages: 'English, French', currencyCode: 'CAD', currencyName: 'Canadian Dollar', flag: 'https://flagcdn.com/ca.svg' },
    'Australia': { name: 'Australia', capital: 'Canberra', languages: 'English', currencyCode: 'AUD', currencyName: 'Australian Dollar', flag: 'https://flagcdn.com/au.svg' },
    'France': { name: 'France', capital: 'Paris', languages: 'French', currencyCode: 'EUR', currencyName: 'Euro', flag: 'https://flagcdn.com/fr.svg' }
}

const rates = {
    'USD': { baseCurrency: 'USD', usd: '1.00', kzt: '475.50' },
    'EUR': { baseCurrency: 'EUR', usd: '1.05', kzt: '498.78' },
    'GBP': { baseCurrency: 'GBP', usd: '1.27', kzt: '603.89' },
    'CAD': { baseCurrency: 'CAD', usd: '0.71', kzt: '337.41' },
    'AUD': { baseCurrency: 'AUD', usd: '0.65', kzt: '309.08' }
}

const news = [
    { title: 'US Economy Grows Fastest Pace in Two Years', description: 'Strong consumer spending boosts economy', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop', source: 'BBC Business', publishedAt: '12/23/2025' },
    { title: 'Meta Implements Linux Scheduler', description: 'Infrastructure improvements at Meta', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop', source: 'Tech News', publishedAt: '12/23/2025' },
    { title: 'Ultrasound Technology in Cancer Treatment', description: 'Sound waves show promise fighting tumors', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop', source: 'Medical Science', publishedAt: '12/22/2025' },
    { title: '2025 UK\'s Hottest Year on Record', description: 'Temperature records expected to break', image: 'https://images.unsplash.com/photo-1509391366360-2e938f45cb87?w=400&h=250&fit=crop', source: 'Climate Watch', publishedAt: '12/23/2025' },
    { title: 'Photoshop 1.0 Source Code Released', description: '1990 source code preserved in museum', image: 'https://images.unsplash.com/photo-1460925895917-adf4e7eb6d0f?w=400&h=250&fit=crop', source: 'Tech History', publishedAt: '12/22/2025' }
]

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

app.get('/api/user', async (req, res) => {
    try {
        const person = await fetchRandomUser()
        if (!person) {
            return res.status(500).json({ success: false, error: 'Failed to fetch user data' })
        }
        
        const country = countries[person.country] || countries['United States']
        const exchange = rates[country.currencyCode] || rates['USD']
        
        const userData = {
            ...person,
            age: getAge(person.dob),
            dob: new Date(person.dob).toLocaleDateString('en-US')
        }
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
