import { useState } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { reverseGeocode } from "@/lib/weather"

interface GeolocationBannerProps {
  onSearch: (city: string) => void
  onDismiss: () => void
}

export function GeolocationBanner({ onSearch, onDismiss }: GeolocationBannerProps) {
  const [detecting, setDetecting] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  function handleDetect() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation isn't available in your browser. Try searching manually.")
      return
    }

    setDetecting(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          )
          onSearch(city)
          onDismiss()
        } catch {
          setGeoError("Couldn't determine your city from that location. Try searching manually.")
          setDetecting(false)
        }
      },
      (err) => {
        // err.code 1 = PERMISSION_DENIED
        if (err.code === 1) {
          setGeoError("Location access was denied. You can still search for a city manually.")
        } else {
          setGeoError("Couldn't get your location right now. Try searching manually.")
        }
        setDetecting(false)
      },
      { timeout: 10_000 }
    )
  }

  return (
    <div
      role="region"
      aria-label="Location detection prompt"
      aria-live="polite"
      aria-atomic="true"
      className="w-full max-w-md rounded-lg border border-border bg-card px-5 py-4 shadow-sm"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="flex items-start gap-3">
        <MapPin
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          {geoError ? (
            <p className="text-sm italic text-muted-foreground">{geoError}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Show weather for your location?
              </p>
              <p className="mt-0.5 text-xs italic text-muted-foreground">
                Your coordinates are only sent to OpenWeatherMap for the current lookup.
              </p>
            </>
          )}

          {!geoError && (
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleDetect}
                disabled={detecting}
                aria-label="Detect my location and show local weather"
              >
                {detecting ? "Detecting…" : "Detect my location"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                disabled={detecting}
                aria-label="No thanks, I'll search manually"
              >
                No thanks
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss location prompt"
          className="shrink-0 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
