'use client'

import { useEffect, useState } from 'react'

/**
 * Responsive Indicator - Shows current viewport size and breakpoint in development mode
 * Only visible when NODE_ENV === 'development'
 */
export function ResponsiveIndicator() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [breakpoint, setBreakpoint] = useState('')

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const updateViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setViewport({ width, height })

      // Tailwind breakpoints
      if (width < 640) {
        setBreakpoint('xs')
      } else if (width >= 640 && width < 768) {
        setBreakpoint('sm')
      } else if (width >= 768 && width < 1024) {
        setBreakpoint('md')
      } else if (width >= 1024 && width < 1280) {
        setBreakpoint('lg')
      } else if (width >= 1280 && width < 1536) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }

    // Initial update
    updateViewport()

    // Update on resize
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null

  const breakpointColors: Record<string, string> = {
    xs: '#ef4444', // red
    sm: '#f59e0b', // amber
    md: '#10b981', // green
    lg: '#3b82f6', // blue
    xl: '#8b5cf6', // purple
    '2xl': '#ec4899', // pink
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] pointer-events-none"
      style={{
        fontFamily: 'monospace',
        fontSize: '11px',
      }}
    >
      {/* Main indicator */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: breakpointColors[breakpoint], fontWeight: 'bold' }}>
            {breakpoint.toUpperCase()}
          </span>
          <span style={{ color: '#6b7280', margin: '0 6px' }}>|</span>
          <span style={{ color: '#9ca3af' }}>
            {viewport.width} × {viewport.height}
          </span>
        </div>

        {/* Breakpoint reference */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          {Object.entries(breakpointColors).map(([bp, color]) => (
            <div
              key={bp}
              style={{
                width: '20px',
                height: '4px',
                borderRadius: '2px',
                background: bp === breakpoint ? color : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s',
              }}
              title={bp}
            />
          ))}
        </div>
      </div>

      {/* Touch indicator */}
      {'ontouchstart' in window && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            marginTop: '4px',
            fontSize: '10px',
            color: '#10b981',
          }}
        >
          ✓ Touch Device
        </div>
      )}
    </div>
  )
}

/**
 * Breakpoint Tester - Grid overlay showing Tailwind breakpoints
 * Toggle with Ctrl+Shift+G
 */
export function BreakpointTester() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+G to toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{
        background: 'repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0px, rgba(255, 0, 0, 0.1) 1px, transparent 1px, transparent 40px)',
      }}
    >
      {/* Breakpoint markers */}
      <div className="absolute top-0 left-0 right-0 h-screen">
        {/* sm: 640px */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50"
          style={{ left: '640px' }}
        >
          <span
            className="absolute top-4 left-2 bg-amber-500 text-white px-2 py-1 text-xs rounded"
            style={{ transform: 'translateX(-50%)' }}
          >
            sm: 640px
          </span>
        </div>

        {/* md: 768px */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-green-500/50"
          style={{ left: '768px' }}
        >
          <span
            className="absolute top-4 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded"
            style={{ transform: 'translateX(-50%)' }}
          >
            md: 768px
          </span>
        </div>

        {/* lg: 1024px */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500/50"
          style={{ left: '1024px' }}
        >
          <span
            className="absolute top-4 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded"
            style={{ transform: 'translateX(-50%)' }}
          >
            lg: 1024px
          </span>
        </div>

        {/* xl: 1280px */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-purple-500/50"
          style={{ left: '1280px' }}
        >
          <span
            className="absolute top-4 left-2 bg-purple-500 text-white px-2 py-1 text-xs rounded"
            style={{ transform: 'translateX(-50%)' }}
          >
            xl: 1280px
          </span>
        </div>

        {/* 2xl: 1536px */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-pink-500/50"
          style={{ left: '1536px' }}
        >
          <span
            className="absolute top-4 left-2 bg-pink-500 text-white px-2 py-1 text-xs rounded"
            style={{ transform: 'translateX(-50%)' }}
          >
            2xl: 1536px
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="absolute bottom-4 right-4 bg-black/90 text-white px-4 py-3 rounded-lg text-xs"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="font-bold mb-1">Breakpoint Tester Active</div>
        <div className="text-gray-400">Press Ctrl+Shift+G to toggle</div>
      </div>
    </div>
  )
}

/**
 * Mobile Device Simulator Info
 * Shows common mobile device screen sizes
 */
export function MobileSimulatorInfo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+M to toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null

  const devices = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12/13', width: 390, height: 844 },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S21', width: 360, height: 800 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Pro 11"', width: 834, height: 1194 },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
  ]

  return (
    <div
      className="fixed top-20 right-4 z-[9999] bg-black/95 text-white rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto"
      style={{ pointerEvents: 'auto', fontFamily: 'monospace', fontSize: '11px' }}
    >
      <div className="sticky top-0 bg-black px-4 py-3 border-b border-white/10">
        <div className="font-bold mb-1">📱 Mobile Device Sizes</div>
        <div className="text-gray-400 text-[10px]">Press Ctrl+Shift+M to toggle</div>
      </div>

      <div className="p-3">
        {devices.map((device) => (
          <div
            key={device.name}
            className="py-2 px-3 mb-2 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
              console.log(`Resize to ${device.width}x${device.height} for ${device.name}`)
            }}
          >
            <div className="font-semibold text-white">{device.name}</div>
            <div className="text-gray-400 text-[10px]">
              {device.width} × {device.height}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-white/10 text-gray-400 text-[10px]">
        Tip: Use browser DevTools device toolbar to simulate these sizes
      </div>
    </div>
  )
}
