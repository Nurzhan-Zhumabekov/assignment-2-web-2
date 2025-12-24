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

// ================= API =================
const RANDOM_USER_API = 'https://randomuser.me/api/'
const COUNTRY_API_KEY = process.env.COUNTRY_API_KEY
const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY
const NEWS_API_KEY = process.env.NEWS_API_KEY

// ================= HELPERS =================
function calculateAge(dateString) {
    const birth = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
        age--
    }
    return age
}

// fallback валют по ISO-коду страны
const countryCurrencyMap = {
    FR: 'EUR',
    DE: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    AT: 'EUR',
    BE: 'EUR',
    IE: 'EUR',
    CH: 'CHF',
    GB: 'GBP',
    US: 'USD',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    CN: 'CNY',
    RU: 'RUB',
    TR: 'TRY'
}

// ================= RANDOM USER =================
async function fetchRandomUser() {
    const response = await fetch(RANDOM_USER_API)
    const data = await response.json()
    const u = data.results[0]

    return {
        firstName: u.name.first,
        lastName: u.name.last,
        gender: u.gender,
        picture: u.picture.large,
        dob: u.dob.date,
        age: calculateAge(u.dob.date),
        city: u.location.city,
        country: u.location.country,
        address: `${u.location.street.name}, ${u.location.street.number}`
    }
}

// ================= COUNTRY INFO =================
async function fetchCountryData(countryName) {
    const url = `https://api.countrylayer.com/v2/name/${encodeURIComponent(countryName)}?access_key=${COUNTRY_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
        return {
            name: countryName,
            capital: 'N/A',
            languages: 'N/A',
            currencyCode: 'USD',
            currencyName: 'US Dollar',
            flag: ''
        }
    }

    const c = data[0]

    let languages = 'N/A'
    if (Array.isArray(c.languages)) {
        languages = c.languages.map(l => l.name).join(', ')
    } else if (typeof c.languages === 'object') {
        languages = Object.values(c.languages).join(', ')
    }

    const currencyCode =
        c.currencies?.[0]?.code ||
        countryCurrencyMap[c.alpha2Code] ||
        'USD'

    const currencyName =
        c.currencies?.[0]?.name || currencyCode

    return {
        name: c.name,
        capital: c.capital || 'N/A',
        languages,
        currencyCode,
        currencyName,
        flag: c.alpha2Code
            ? `https://flagcdn.com/w80/${c.alpha2Code.toLowerCase()}.png`
            : ''
    }
}

// ================= EXCHANGE RATES =================
// Всегда возвращает курс в USD и KZT
async function fetchExchangeRates(baseCurrency) {
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${baseCurrency}`
    const response = await fetch(url)
    const data = await response.json()

    if (!data.conversion_rates) {
        return {
            base: baseCurrency,
            usd: 'N/A',
            kzt: 'N/A'
        }
    }

    return {
        base: baseCurrency,
        usd: data.conversion_rates.USD
            ? data.conversion_rates.USD.toFixed(2)
            : 'N/A',
        kzt: data.conversion_rates.KZT
            ? data.conversion_rates.KZT.toFixed(2)
            : 'N/A'
    }
}

// ================= NEWS =================
async function fetchNews(country) {
    if (!NEWS_API_KEY) return []

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(country)}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    return Array.isArray(data.articles)
        ? data.articles.slice(0, 5).map(a => ({
            title: a.title,
            description: a.description,
            image: a.urlToImage,
            url: a.url
        }))
        : []
}

// ================= MAIN API =================
app.get('/api/user', async (req, res) => {
    try {
        const user = await fetchRandomUser()
        const country = await fetchCountryData(user.country)
        const exchange = await fetchExchangeRates(country.currencyCode)
        const news = await fetchNews(user.country)

        res.json({
            user: {
                ...user,
                dob: new Date(user.dob).toLocaleDateString('en-US')
            },
            country,
            exchange,
            news
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
