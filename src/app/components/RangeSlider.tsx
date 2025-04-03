"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, ...props }, ref) => {
  // Extraer las propiedades que queremos manejar directamente
  const { 
    min = 0, 
    max = 100, 
    step, 
    value, 
    defaultValue,
    onValueChange,
    onValueCommit,
    ...otherProps 
  } = props;
  
  // Valor inicial para el estado local
  const initialValue = value || defaultValue || [min, max];
  
  // Guardar en estado local para asegurar que los thumbs se muevan correctamente
  const [localValue, setLocalValue] = React.useState<number[]>(initialValue);
  
  // Actualizar el estado local cuando cambian las props externas
  React.useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Manejar el cambio de valor durante el arrastre
  const handleValueChange = (newValue: number[]) => {
    console.log("RangeSlider - handleValueChange:", newValue);
    setLocalValue(newValue);
    
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  // Manejar el cambio de valor cuando se suelta el control
  const handleValueCommit = (newValue: number[]) => {
    console.log("RangeSlider - handleValueCommit:", newValue);
    
    if (onValueCommit) {
      onValueCommit(newValue);
    } else if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  return (
    <div className="range-slider-container relative h-6 flex items-center">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        min={min}
        max={max}
        step={step}
        value={localValue}
        defaultValue={undefined}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        {...otherProps}
      >
        <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-black" />
        </SliderPrimitive.Track>
        
        <SliderPrimitive.Thumb 
          className="block h-[12px] w-[12px] rounded-full border border-gray-400 bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-grab hover:scale-110 active:cursor-grabbing transition-all duration-200 shadow-sm"
        />
        <SliderPrimitive.Thumb 
          className="block h-[12px] w-[12px] rounded-full border border-gray-400 bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-grab hover:scale-110 active:cursor-grabbing transition-all duration-200 shadow-sm"
        />
      </SliderPrimitive.Root>
    </div>
  );
})
RangeSlider.displayName = "RangeSlider";

export { RangeSlider } 