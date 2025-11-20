'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { fab } from '@/lib/animations'

export function FAB() {
  const router = useRouter()

  return (
    <motion.button
      variants={fab}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push('/calendar/new')}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full gradient-love-vivid shadow-love flex items-center justify-center touch-target"
      aria-label="Ajouter un événement"
    >
      <Plus className="w-6 h-6 text-white" />
    </motion.button>
  )
}
