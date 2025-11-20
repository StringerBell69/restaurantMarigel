'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Loader2, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { slideUp, heartPop } from '@/lib/animations'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0
    if (pass.length < 6) return 1
    if (pass.length < 10) return 2
    return 3
  }

  const strength = getPasswordStrength(password)
  const strengthColors = ['', 'bg-destructive', 'bg-love-warning', 'bg-love-success']
  const strengthLabels = ['', 'Faible', 'Moyen', 'Fort']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, name)
      setSuccess(true)

      // Confetti hearts animation
      setTimeout(() => {
        toast.success('Compte créé avec succès! 💕')
        router.push('/couple/setup')
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div className="text-center">
        <motion.div
          variants={heartPop}
          initial="initial"
          animate="animate"
          className="text-8xl mb-4"
        >
          💖
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Bienvenue !</h2>
        <p className="text-muted-foreground">Création de votre espace...</p>
      </motion.div>
    )
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
          💖
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">Rejoignez-nous</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Créez votre calendrier de couple en quelques instants
        </p>
      </div>

      {/* Register Form */}
      <Card className="p-6 shadow-love">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nom
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="touch-target"
            />
          </div>

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
            {password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded transition-all ${
                        i <= strength ? strengthColors[strength] : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Création...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>
      </Card>

      {/* Sign in link */}
      <p className="text-center text-sm">
        <span className="text-muted-foreground">Déjà un compte ? </span>
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </motion.div>
  )
}
