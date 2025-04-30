import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

type AirportSelectProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder: string
}

const AIRPORTS = [
  { code: "AKL", name: "Auckland Airport" },
  { code: "CDG", name: "Charles de Gaulle Airport (Paris)" },
  { code: "DUB", name: "Dublin Airport" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "IST", name: "Istanbul Airport" },
  { code: "JFK", name: "John F. Kennedy International Airport (New York)" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "NYC", name: "New York City (All Airports)" },
  { code: "SEA", name: "Seattle-Tacoma International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport" }
]

export default function AirportSelect<T extends FieldValues>({
  form,
  name,
  label,
  placeholder
}: AirportSelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full hover:cursor-pointer">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {AIRPORTS.map((airport) => (
                <SelectItem
                  key={airport.code}
                  value={airport.code}
                  className="hover:cursor-pointer"
                >
                  {airport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
