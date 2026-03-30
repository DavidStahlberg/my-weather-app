import { Clock } from "lucide-react"

interface RecentSearchesProps {
  cities: string[]
  onSearch: (city: string) => void
  disabled?: boolean
}

export function RecentSearches({
  cities,
  onSearch,
  disabled = false,
}: RecentSearchesProps) {
  if (!cities.length) return null

  return (
    <div className="w-full max-w-md" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-2 flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-muted-foreground/60" aria-hidden="true" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
          Recent
        </span>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Recent city searches">
        {cities.map((city) => (
          <li key={city}>
            <button
              type="button"
              onClick={() => onSearch(city)}
              disabled={disabled}
              aria-label={`Search weather for ${city}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
