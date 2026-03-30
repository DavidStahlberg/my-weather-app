const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string

export interface WeatherData {
  city: string
  country: string
  temp: number
  feelsLike: number
  condition: string
  description: string
  icon: string
  humidity: number
  windSpeed: number
  forecast: DailyForecast[]
}

export interface DailyForecast {
  date: string
  tempMin: number
  tempMax: number
  condition: string
  icon: string
}

interface GeoResult {
  name: string
  lat: number
  lon: number
  country: string
}

interface OWMCurrentWeather {
  name: string
  sys: { country: string }
  main: { temp: number; feels_like: number; humidity: number }
  weather: Array<{ main: string; description: string; icon: string }>
  wind: { speed: number }
}

interface OWMForecastItem {
  dt_txt: string
  main: { temp_min: number; temp_max: number }
  weather: Array<{ main: string; icon: string }>
}

interface OWMForecastResponse {
  list: OWMForecastItem[]
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 401) throw new Error("Invalid API key. Check your .env configuration.")
    if (res.status === 404) throw new Error("City not found.")
    throw new Error(`Request failed (${res.status}). Please try again.`)
  }
  return res.json() as Promise<T>
}

export async function fetchWeather(cityQuery: string): Promise<WeatherData> {
  // Step 1: Geocoding — convert city name to coordinates
  const geoUrl =
    `https://api.openweathermap.org/geo/1.0/direct` +
    `?q=${encodeURIComponent(cityQuery)}&limit=1&appid=${API_KEY}`

  const geoResults = await fetchJson<GeoResult[]>(geoUrl)

  if (!geoResults.length) {
    throw new Error(`"${cityQuery}" wasn't found. Try a different spelling or add a country code, e.g. "Paris, FR".`)
  }

  const { lat, lon, name, country } = geoResults[0]

  // Step 2: Current weather + forecast in parallel
  const weatherUrl =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

  const [current, forecastData] = await Promise.all([
    fetchJson<OWMCurrentWeather>(weatherUrl),
    fetchJson<OWMForecastResponse>(forecastUrl),
  ])

  // Aggregate 3-hourly forecast entries into daily high/low, skipping today
  const todayStr = new Date().toISOString().slice(0, 10)
  const dayMap = new Map<
    string,
    { tempMin: number; tempMax: number; condition: string; icon: string }
  >()

  for (const item of forecastData.list) {
    const dateStr = item.dt_txt.slice(0, 10)
    if (dateStr === todayStr) continue

    const existing = dayMap.get(dateStr)
    if (!existing) {
      dayMap.set(dateStr, {
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        condition: item.weather[0].main,
        // Prefer the midday icon (12:00) for a representative look; first seen otherwise
        icon: item.weather[0].icon,
      })
    } else {
      existing.tempMin = Math.min(existing.tempMin, Math.round(item.main.temp_min))
      existing.tempMax = Math.max(existing.tempMax, Math.round(item.main.temp_max))
      // Replace icon with the midday slot when available
      if (item.dt_txt.includes("12:00:00")) {
        existing.icon = item.weather[0].icon
        existing.condition = item.weather[0].main
      }
    }
  }

  const forecast: DailyForecast[] = [...dayMap.entries()]
    .slice(0, 5)
    .map(([date, data]) => ({ date, ...data }))

  return {
    city: name,
    country,
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0].main,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed * 3.6), // m/s → km/h
    forecast,
  }
}
