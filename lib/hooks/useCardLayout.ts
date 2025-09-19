import { useState, useRef, useLayoutEffect } from "react"

export const useCardLayout = (dependencies: any[]) => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Keep the container height in sync with the inner content to avoid layout jumps when content changes
  useLayoutEffect(() => {
    if (!contentRef.current) return

    // initial measurement
    const measure = () => {
      const h = contentRef.current ? Math.ceil(contentRef.current.getBoundingClientRect().height) : 0
      setContainerHeight(h || null)
    }

    measure()

    // Observe resize of the content to update container height
    const ro = new ResizeObserver(() => measure())
    ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, dependencies)

  return {
    containerHeight,
    cardRef,
    contentRef
  }
}
