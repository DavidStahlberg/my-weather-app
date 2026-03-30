import { BookOpen } from "lucide-react"

export function Header() {
  return (
    <header className="w-full bg-card border-b-2 border-primary/40 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-3">
          <BookOpen
            aria-hidden="true"
            focusable={false}
            className="w-9 h-9 text-primary"
            strokeWidth={1.5}
          />
          <h1
            className="font-handwritten text-5xl font-semibold tracking-wide text-foreground"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            Nimbus
          </h1>
        </div>
        <p
          className="text-muted-foreground italic text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          your weather, your way
        </p>
      </div>
    </header>
  )
}
