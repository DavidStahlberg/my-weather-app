import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CityCardProps {
  city: string
}

export function CityCard({ city }: CityCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date())

  return (
    <Card
      className="w-full max-w-md bg-card border border-border shadow-md"
      role="region"
      aria-label={`Weather information for ${city}`}
    >
      <CardHeader className="pb-3">
        <p
          className="text-muted-foreground text-sm"
          style={{ fontFamily: "var(--font-handwritten)", fontSize: "1rem" }}
        >
          Today's Entry
        </p>
        <CardTitle
          className="text-4xl font-semibold text-foreground leading-tight"
          style={{ fontFamily: "var(--font-handwritten)" }}
        >
          {city}
        </CardTitle>
        <CardDescription
          className="italic text-muted-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="border-t border-border pt-4">
          <p
            className="italic text-muted-foreground text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Weather details coming soon…
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
