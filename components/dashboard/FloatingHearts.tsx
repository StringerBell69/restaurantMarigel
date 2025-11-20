'use client'

import { motion } from 'framer-motion'

export function FloatingHearts() {
  const hearts = ['💕', '💗', '💖', '💝', '💓']

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {hearts.map((heart, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: '110%',
            rotate: 0,
          }}
          animate={{
            y: '-10%',
            rotate: [0, 10, -10, 0],
            x: `${Math.random() * 100}%`,
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        >
          {heart}
        </motion.div>
      ))}
    </div>
  )
}
