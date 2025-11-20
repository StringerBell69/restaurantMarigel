/**
 * Framer Motion animation variants for the Couple Calendar app
 * All animations follow the "love theme" - soft, smooth, and delightful
 */

import { Variants } from 'framer-motion'

// ============================================
// PAGE TRANSITIONS
// ============================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const slideFromBottom: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
}

export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

export const buttonTap = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.15 },
}

export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: '0 8px 30px rgba(255, 107, 157, 0.2)',
    transition: { duration: 0.2 },
  },
}

export const iconBounce = {
  whileHover: {
    scale: 1.1,
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.5 },
  },
}

// ============================================
// LOVE-THEMED ANIMATIONS
// ============================================

export const heartPop: Variants = {
  initial: { scale: 0, rotate: -30 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 10, 0],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const heartFloat = {
  animate: {
    y: [0, -100],
    opacity: [0, 1, 1, 0],
    scale: [0.8, 1, 1, 0.8],
    transition: {
      duration: 3,
      ease: 'easeOut',
    },
  },
}

export const sparkle: Variants = {
  initial: { scale: 0, opacity: 0, rotate: 0 },
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180],
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
}

// ============================================
// STAGGER CHILDREN
// ============================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// ============================================
// SPECIAL ANIMATIONS
// ============================================

// Counter animation for days counter
export const counterAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Confetti-like animation for success states
export const confettiPop = {
  initial: { scale: 0, y: 0 },
  animate: {
    scale: [0, 1.5, 1],
    y: [0, -50, -100],
    opacity: [0, 1, 0],
    transition: { duration: 1.5, ease: 'easeOut' },
  },
}

// Gentle pulse animation
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Floating animation for background elements
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================
// BOTTOM SHEET / MODAL ANIMATIONS
// ============================================

export const bottomSheet: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// ============================================
// NAVIGATION ANIMATIONS
// ============================================

export const navItem: Variants = {
  inactive: {
    scale: 1,
    opacity: 0.6,
  },
  active: {
    scale: 1.1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
}

export const fab: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    rotate: 180,
    transition: { duration: 0.2 },
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Creates a heart popping animation at random positions
 */
export const createRandomHeartAnimation = (index: number) => ({
  initial: { scale: 0, x: 0, y: 0, opacity: 0 },
  animate: {
    scale: [0, 1, 0],
    x: [0, Math.random() * 100 - 50],
    y: [0, -100 - Math.random() * 50],
    opacity: [0, 1, 0],
    rotate: [0, Math.random() * 360],
    transition: {
      duration: 2 + Math.random(),
      delay: index * 0.1,
      ease: 'easeOut',
    },
  },
})

/**
 * Transition configuration for smooth page changes
 */
export const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
}
