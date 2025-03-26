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
  // Valores mínimo y máximo
  const min = props.min !== undefined ? props.min : 0;
  const max = props.max !== undefined ? props.max : 100;
  
  // Usar value proporcionado o defaultValue si existe
  const defaultValues = props.defaultValue || [min, max];
  
  return (
    <div className="range-slider-container">
      {/* Círculos decorativos en los extremos */}
      <div className="range-slider-decorators">
        <div className="min-decorator"></div>
        <div className="max-decorator"></div>
      </div>
      
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        defaultValue={defaultValues}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-200">
          <SliderPrimitive.Range className="absolute h-full bg-black" />
        </SliderPrimitive.Track>
        
        <SliderPrimitive.Thumb 
          className="block h-3 w-3 rounded-full border border-black bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab hover:scale-110 active:cursor-grabbing transition-all duration-300"
        />
        <SliderPrimitive.Thumb 
          className="block h-3 w-3 rounded-full border border-black bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab hover:scale-110 active:cursor-grabbing transition-all duration-300"
        />
      </SliderPrimitive.Root>
    </div>
  );
})
RangeSlider.displayName = "RangeSlider";

export { RangeSlider } 