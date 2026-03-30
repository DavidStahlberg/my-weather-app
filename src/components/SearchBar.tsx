import { useRef, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
    // Retain focus on input for keyboard users
    inputRef.current?.focus()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      aria-label="City weather search"
      noValidate
    >
      <label htmlFor="city-input" className="sr-only">
        Search for a city
      </label>
      <Input
        ref={inputRef}
        id="city-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a city name…"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={isLoading}
        className="flex-1 bg-card border-border placeholder:text-muted-foreground/60 focus-visible:ring-ring"
        style={{ fontFamily: "var(--font-sans)" }}
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring disabled:opacity-60"
        aria-label="Search weather for entered city"
        aria-disabled={isLoading}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <Search aria-hidden="true" focusable={false} className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  )
}
