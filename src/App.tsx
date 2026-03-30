import { useState } from "react"
import { Header } from "@/components/Header"
import { SearchBar } from "@/components/SearchBar"
import { CityCard } from "@/components/CityCard"
import { fetchWeather, type WeatherData } from "@/lib/weather"

type Status = "idle" | "loading" | "error"

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSearch(city: string) {
    setStatus("loading")
    setErrorMessage("")
    try {
      const data = await fetchWeather(city)
      setWeather(data)
      setStatus("idle")
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
        className="flex-1 flex flex-col items-center px-4 py-10 gap-8"
      >
        <SearchBar onSearch={handleSearch} isLoading={status === "loading"} />

        {/* Live region — announces state changes to screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {status === "loading" && "Loading weather data…"}
          {status === "idle" && weather && `Showing weather for ${weather.city}`}
          {status === "error" && errorMessage}
        </div>

        {status === "loading" && (
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

        {weather && status !== "loading" && <CityCard weather={weather} />}
      </main>
    </div>
  )
}
