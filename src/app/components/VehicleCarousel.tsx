"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

// This is a reusable carousel component that can be used for both new and used vehicles
interface VehicleCarouselProps {
  title: string
  vehicles: any[]
  badgeText: string
  badgeClassName: string
  viewAllLink: string
  viewAllText: string
  viewAllButtonClassName: string
  renderVehicleCard: (props: any) => JSX.Element
  maxDisplay?: number
}

export default function VehicleCarousel({
  title,
  vehicles,
  badgeText,
  badgeClassName,
  viewAllLink,
  viewAllText,
  viewAllButtonClassName,
  renderVehicleCard,
  maxDisplay = 8,
}: VehicleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Display only up to maxDisplay vehicles on the main page
  const displayedVehicles = vehicles.slice(0, maxDisplay)

  // Effect to adjust itemsPerPage based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // mobile
        setItemsPerPage(1)
        setIsMobile(true)
        setIsTablet(false)
      } else if (window.innerWidth < 1024) {
        // tablet
        setItemsPerPage(2)
        setIsMobile(false)
        setIsTablet(true)
      } else {
        // desktop
        setItemsPerPage(3)
        setIsMobile(false)
        setIsTablet(false)
      }
    }

    handleResize() // Initial call
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    if (isMobile) {
      const maxIndex = displayedVehicles.length - 1
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    } else {
      const maxIndex = Math.max(0, displayedVehicles.length - itemsPerPage)
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }
  }

  const prevSlide = () => {
    if (isMobile) {
      const maxIndex = displayedVehicles.length - 1
      setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    } else {
      const maxIndex = Math.max(0, displayedVehicles.length - itemsPerPage)
      setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }
  }

  const totalPages = Math.ceil(displayedVehicles.length / itemsPerPage)
  const currentPage = Math.floor(activeIndex / itemsPerPage)

  // For mobile, limit the activeIndex to the range of available vehicles
  useEffect(() => {
    if (isMobile && activeIndex >= displayedVehicles.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, isMobile, displayedVehicles.length])

  return (
    <div className="relative py-6">
      <div className="container px-2 sm:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-center">{title}</h2>
          <div className="h-0.5 w-20 bg-primary rounded-full mb-2"></div>
          <div className="h-0.5 w-20 bg-primary rounded-full"></div>
        </div>

        <div className="relative px-2">
          {isMobile ? (
            // Mobile view - each vehicle takes the full visible width
            <div className="overflow-hidden px-0">
              <motion.div
                className="flex"
                initial={false}
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {displayedVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} style={{ width: "100%", flex: "0 0 100%" }} className="px-2">
                    {renderVehicleCard({
                      vehicle,
                      index,
                      isMobile,
                      badgeText,
                      badgeClassName,
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            // Tablet/desktop view with grid
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                initial={false}
                animate={{ x: `-${activeIndex * (100 / 3)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  width: "auto",
                }}
              >
                {displayedVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} style={{ width: "33.333%" }} className="px-1 sm:px-2 flex-shrink-0">
                    {renderVehicleCard({
                      vehicle,
                      index,
                      isMobile,
                      badgeText,
                      badgeClassName,
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Carousel navigation (buttons and indicators) */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 sm:-left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 sm:-right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Next</span>
          </Button>

          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-300 ${i === currentPage ? "bg-primary w-6 sm:w-8" : "bg-muted hover:bg-primary/50"}`}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => setActiveIndex(i * itemsPerPage)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button
              asChild
              variant="default"
              className={`rounded-full px-8 py-3 font-semibold text-sm ${viewAllButtonClassName}`}
            >
              <Link href={viewAllLink} className="inline-flex items-center">
                {viewAllText}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

