import { BookOpen, Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="w-full border-b-2 border-primary/40 bg-card shadow-sm">
      <div className="relative mx-auto flex max-w-2xl items-center justify-center px-4 py-6">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-3">
            <BookOpen
              aria-hidden="true"
              focusable={false}
              className="h-9 w-9 text-primary"
              strokeWidth={1.5}
            />
            <h1
              className="text-5xl font-semibold tracking-wide text-foreground"
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              Nimbus
            </h1>
          </div>
          <p
            className="text-sm italic text-muted-foreground"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            your weather, your way
          </p>
        </div>

        {/* Theme toggle — absolutely positioned to the right */}
        <button
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  )
}
