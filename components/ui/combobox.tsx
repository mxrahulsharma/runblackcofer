"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface ComboboxProps {
  selectedValue: string;
  onChange: (selectedValue: string) => void;
  choices: string[]; // Assuming your component uses 'choices'
  filterKey: string; // Key for the filter (e.g., 'country', 'end_year')
  setData: (data: any[]) => void; // Callback to update the data state
}

export function ComboboxDemo({
  selectedValue,
  onChange,
  choices,
  filterKey,
  setData,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>(selectedValue);

  React.useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

//   const fetchAndSetData = async (selectedValue: string) => {
//     try {
//       const response = await fetch(`/api/get?${filterKey}=${selectedValue}`);
//       const data = await response.json();
//       setData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
           {value ? (
            <>
              <span className="truncate">{value}</span>
            </>
          ) : (
            "Select..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No {filterKey} found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {choices.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value ? undefined : currentValue
                    );
                    onChange(
                      currentValue === value ? "" : currentValue
                    );
                    setOpen(true);
                    // fetchAndSetData(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}