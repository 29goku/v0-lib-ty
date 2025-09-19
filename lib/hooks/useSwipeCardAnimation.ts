import { useMotionValue, useTransform, useAnimation } from "framer-motion"
import { SWIPE_ANIMATION_CONFIG } from "../swipe-card-constants"

export const useSwipeCardAnimation = () => {
  // Smooth motion values for Tinder-style swipe
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth transform values with reduced sensitivity
  const rotate = useTransform(x, SWIPE_ANIMATION_CONFIG.ROTATION_POSITIONS, SWIPE_ANIMATION_CONFIG.ROTATION_RANGE)
  const scale = useTransform(x, SWIPE_ANIMATION_CONFIG.SCALE_POSITIONS, SWIPE_ANIMATION_CONFIG.SCALE_RANGE)

  // Visual indicator transforms with smoother transitions
  const prevIndicatorOpacity = useTransform(x, SWIPE_ANIMATION_CONFIG.INDICATOR_OPACITY_RANGES.prev, [1, 0.6, 0])
  const prevIndicatorScale = useTransform(x, SWIPE_ANIMATION_CONFIG.INDICATOR_OPACITY_RANGES.prev, SWIPE_ANIMATION_CONFIG.INDICATOR_SCALE_RANGES.prev)
  const nextIndicatorOpacity = useTransform(x, SWIPE_ANIMATION_CONFIG.INDICATOR_OPACITY_RANGES.next, [0, 0.6, 1])
  const nextIndicatorScale = useTransform(x, SWIPE_ANIMATION_CONFIG.INDICATOR_OPACITY_RANGES.next, SWIPE_ANIMATION_CONFIG.INDICATOR_SCALE_RANGES.next)

  // Animation controls for spring-back
  const controls = useAnimation()

  return {
    x,
    y,
    rotate,
    scale,
    prevIndicatorOpacity,
    prevIndicatorScale,
    nextIndicatorOpacity,
    nextIndicatorScale,
    controls
  }
}
