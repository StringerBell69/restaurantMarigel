'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { slideUp } from '@/lib/animations'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Connexion réussie!')
      router.push('/')
    } catch (error) {
      toast.error('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Logo/Icon */}
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-3"
        >
          💕
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">Bienvenue !</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connectez-vous pour retrouver votre calendrier de couple
        </p>
      </div>

      {/* Login Form */}
      <Card className="p-6 shadow-love">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="touch-target"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="touch-target"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-love-vivid text-white font-medium touch-target"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </Card>

      {/* Sign up link */}
      <p className="text-center text-sm">
        <span className="text-muted-foreground">Pas encore de compte ? </span>
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </motion.div>
  )
}
