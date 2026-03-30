import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { SearchBar } from "@/components/SearchBar"
import { CityCard } from "@/components/CityCard"
import { GeolocationBanner } from "@/components/GeolocationBanner"
import { RecentSearches } from "@/components/RecentSearches"
import { fetchWeather, type WeatherData } from "@/lib/weather"

type Status = "idle" | "loading" | "error"

const GEO_KEY = "nimbus-geo-prompted"
const RECENT_KEY = "nimbus-recent-searches"
const MAX_RECENT = 5

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent)
  const [showGeoBanner, setShowGeoBanner] = useState(false)

  // Show geolocation banner only on first-ever visit
  useEffect(() => {
    if (!localStorage.getItem(GEO_KEY)) {
      setShowGeoBanner(true)
    }
  }, [])

  function dismissGeoBanner() {
    setShowGeoBanner(false)
    localStorage.setItem(GEO_KEY, "true")
  }

  async function handleSearch(city: string) {
    setStatus("loading")
    setErrorMessage("")
    try {
      const data = await fetchWeather(city)
      setWeather(data)
      setStatus("idle")
      // Persist to recent searches, deduplicating and capping at 5
      setRecentSearches((prev) => {
        const updated = [data.city, ...prev.filter((c) => c !== data.city)].slice(
          0,
          MAX_RECENT
        )
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      setStatus("error")
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
      setWeather(null)
    }
  }

  const isLoading = status === "loading"

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Skip-to-content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Skip to main content
      </a>

      <Header />

      <main
        id="main-content"
        className="flex-1 flex flex-col items-center px-4 py-10 gap-6"
      >
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <RecentSearches
          cities={recentSearches}
          onSearch={handleSearch}
          disabled={isLoading}
        />

        {showGeoBanner && (
          <GeolocationBanner onSearch={handleSearch} onDismiss={dismissGeoBanner} />
        )}

        {/* Live region — announces state changes to screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isLoading && "Loading weather data…"}
          {status === "idle" && weather && `Showing weather for ${weather.city}`}
          {status === "error" && errorMessage}
        </div>

        {isLoading && (
          <p
            aria-hidden="true"
            className="italic text-muted-foreground text-sm"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Looking up the weather…
          </p>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="w-full max-w-md rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {errorMessage}
          </div>
        )}

        {weather && !isLoading && <CityCard weather={weather} />}
      </main>
    </div>
  )
}
