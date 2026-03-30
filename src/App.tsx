import { useState } from "react"
import { Header } from "@/components/Header"
import { SearchBar } from "@/components/SearchBar"
import { CityCard } from "@/components/CityCard"

export default function App() {
  const [searchedCity, setSearchedCity] = useState<string | null>(null)

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
        <SearchBar onSearch={setSearchedCity} />

        {/* Live region — announces city changes to screen readers */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {searchedCity ? `Showing weather for ${searchedCity}` : ""}
        </div>

        {searchedCity && <CityCard city={searchedCity} />}
      </main>
    </div>
  )
}
