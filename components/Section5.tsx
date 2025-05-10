"use client"
import { useEffect, useRef, useState } from "react"

interface Location {
  country: string
  flag: string
}

const locations: Location[] = [
  { country: "Himachal Pradesh", flag: "/destination1.jpg" },
  { country: "Ladakh", flag: "/destination2.jpg" },
  { country: "Uttrakhand", flag: "/destination3.jpg" },
]

function Section5() {
  const pathRef = useRef<SVGPathElement>(null)
  const [positions, setPositions] = useState<{ x: number; y: number; persistentIndex: number }[]>([])
  const [offset, setOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pathD, setPathD] = useState("")
  const [viewBox, setViewBox] = useState("0 0 1600 500")

  const updatePath = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    if (width >= 768) {
      // Desktop: Original path
      setViewBox("0 0 1600 500")
      setPathD("M0,250 Q400,100 800,250 Q1200,400 1600,250")
    } else {
      // Mobile: Dynamic path
      setViewBox(`0 0 ${width * 2} ${height * 0.5}`)
      setPathD(`M0,${height * 0.4} Q${width * 0.75},${height * 0.1} ${width * 1.5},${height * 0.4} Q${width * 2.25},${height * 0.7} ${width * 3},${height * 0.4}`)
    }
  }

  useEffect(() => {
    updatePath()
    window.addEventListener("resize", updatePath)
    return () => window.removeEventListener("resize", updatePath)
  }, [])

  useEffect(() => {
    const updatePositions = () => {
      if (!pathRef.current) return

      const pathLength = pathRef.current.getTotalLength()
      if (!isFinite(pathLength) || pathLength <= 0) {
        console.warn("Invalid path length:", pathLength)
        return
      }

      const step = pathLength / (locations.length * (window.innerWidth < 768 ? 1.5 : 1))

      const newPositions = locations.map((_, index) => {
        const length = (index * step + offset) % pathLength
        if (!isFinite(length)) return { x: 0, y: 0, persistentIndex: index }

        const point = pathRef.current!.getPointAtLength(length)
        const persistentIndex = Math.floor((index * step + offset) / pathLength) * locations.length + index

        return { x: point.x, y: point.y, persistentIndex }
      }).filter((pos) => pos)

      setPositions(newPositions)
    }

    updatePositions()

    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [offset, pathD])

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setOffset((prev) => (prev + 2) % 10000) // Continuous loop
      }, 50)

      return () => clearInterval(interval)
    }
  }, [isPaused])

  const handleLeftClick = () => {
    setOffset((prev) => prev - 30)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 3000)
  }

  const handleRightClick = () => {
    setOffset((prev) => prev + 30)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 3000)
  }

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg5.png')" }}
    >
      <h1 className="text-center text-black text-4xl md:text-5xl lg:text-6xl font-bold mt-14 mb-5">
        Destination For Every BucketList
      </h1>

      <div className="w-full md:min-h-screen h-[500px] bg-gradient-to-b flex items-center justify-center">
        <div className="w-full py-16 px-4 mb-20 relative overflow-visible">
          
          {/* Left Arrow */}
          <button
            onClick={handleLeftClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black p-4 rounded-full z-20 hover:bg-amber-300/50"
          >
            ◀
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleRightClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black p-4 rounded-full z-20 hover:bg-amber-300/50"
          >
            ▶
          </button>

          {/* Dashed curved path */}
          <svg 
            className="absolute top-[70%] left-0 w-full h-[500px] -translate-y-1/2 z-0 overflow-visible pointer-events-none"
            viewBox={viewBox}
          >
            <path
              ref={pathRef}
              d={pathD}
              stroke="#666"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 8"
              className="opacity-50 transition-all duration-500"
            />

            {positions.map((pos) => {
              const location = locations[pos.persistentIndex % locations.length]
              const isAbove = pos.persistentIndex % 2 === 0

              // 🔥 Dynamic image & text scaling
              const imgSize = window.innerWidth >= 768 
                ? 200 
                : Math.min(Math.max(window.innerWidth * 0.3, 170), 250)

              const circleSize = window.innerWidth >= 768 
                ? 8 
                : Math.min(Math.max(window.innerWidth * 0.015, 6), 10)

              // ✅ Increased gap for below-text images
              const textGap = isAbove 
                ? (window.innerWidth >= 768 ? 50 : 70)    // Gap above image
                : (window.innerWidth >= 768 ? 50 : 70)   // Larger gap below image

              const textSize = window.innerWidth >= 768 
                ? "22"   // Larger text on desktop
                : "28"   // Larger text on smaller screens

              return (
                <g key={pos.persistentIndex} className="transition-all duration-100">
                  
                  {/* ✅ Marker Circle */}
                  <circle cx={pos.x} cy={pos.y} r={circleSize} fill="#16a34a" />

                  {/* ✅ Flag Image */}
                  <foreignObject
                    x={pos.x - imgSize / 2}
                    y={isAbove ? pos.y - imgSize - textGap : pos.y + textGap}
                    width={imgSize}
                    height={imgSize}
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <div
                      onMouseEnter={() => {
                        setIsPaused(true)
                        setHoveredIndex(pos.persistentIndex)
                      }}
                      onMouseLeave={() => {
                        setIsPaused(false)
                        setHoveredIndex(null)
                      }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={location.flag}
                        alt={location.country}
                        className="w-full h-full object-cover rounded-lg shadow-md border-2 border-amber-400"
                      />
                    </div>
                  </foreignObject>

                  {/* ✅ Country Name Label */}
                  <text
                    x={pos.x}
                    y={isAbove ? pos.y - imgSize - textGap - 10 : pos.y + imgSize + textGap + 20}
                    textAnchor="middle"
                    fill="#000000"
                    fontSize={textSize}
                    fontWeight="bold"
                  >
                    {location.country}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Section5