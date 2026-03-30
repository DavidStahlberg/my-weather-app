import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Droplets, Wind } from "lucide-react"
import type { WeatherData, DailyForecast } from "@/lib/weather"

interface CityCardProps {
  weather: WeatherData
}

function owmIconUrl(icon: string, size: "1x" | "2x" = "2x") {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}

function formatFullDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date())
}

function formatDayLabel(dateStr: string): string {
  // Parse as local noon to avoid timezone-shift edge cases
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(`${dateStr}T12:00:00`)
  )
}

function ForecastRow({ day }: { day: DailyForecast }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/40 py-2 last:border-0">
      <span
        className="w-10 shrink-0 text-sm text-muted-foreground"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {formatDayLabel(day.date)}
      </span>
      <img
        src={owmIconUrl(day.icon, "1x")}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
      />
      <span
        className="flex-1 text-sm italic text-muted-foreground"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {day.condition}
      </span>
      <span
        className="shrink-0 text-sm"
        aria-label={`Low ${day.tempMin}, high ${day.tempMax} degrees Celsius`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <span className="text-muted-foreground">{day.tempMin}°</span>
        <span className="mx-1 text-muted-foreground/40">/</span>
        <span className="font-medium">{day.tempMax}°</span>
      </span>
    </div>
  )
}

export function CityCard({ weather }: CityCardProps) {
  return (
    <Card
      className="w-full max-w-md border border-border bg-card shadow-md"
      role="region"
      aria-label={`Weather information for ${weather.city}`}
    >
      <CardHeader className="pb-2">
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-handwritten)", fontSize: "1rem" }}
        >
          Today's Entry
        </p>
        <CardTitle
          className="text-4xl font-semibold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-handwritten)" }}
        >
          {weather.city}
          <span
            className="ml-2 text-2xl font-normal text-muted-foreground"
            aria-label={`Country: ${weather.country}`}
          >
            {weather.country}
          </span>
        </CardTitle>
        <CardDescription
          className="italic text-muted-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {formatFullDate()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Current conditions */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <img
            src={owmIconUrl(weather.icon)}
            alt={weather.description}
            className="-ml-2 h-20 w-20"
          />
          <div>
            <p
              className="text-6xl font-semibold leading-none text-foreground"
              style={{ fontFamily: "var(--font-handwritten)" }}
              aria-label={`${weather.temp} degrees Celsius`}
            >
              {weather.temp}°C
            </p>
            <p
              className="mt-1 capitalize italic text-muted-foreground"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {weather.description}
            </p>
          </div>
        </div>

        {/* Detail strip */}
        <div
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <div className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              <span className="sr-only">Humidity: </span>
              {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              <span className="sr-only">Wind speed: </span>
              {weather.windSpeed} km/h
            </span>
          </div>
          <div className="flex items-center gap-1.5 italic">
            <span className="text-muted-foreground/60">Feels like</span>
            <span>{weather.feelsLike}°C</span>
          </div>
        </div>

        {/* 5-day forecast */}
        {weather.forecast.length > 0 && (
          <div className="border-t border-border pt-4">
            <p
              className="mb-2 text-xs uppercase tracking-widest text-muted-foreground/60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              5-Day Forecast
            </p>
            <div role="list" aria-label="5-day weather forecast">
              {weather.forecast.map((day) => (
                <div key={day.date} role="listitem">
                  <ForecastRow day={day} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
