'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Couple, UserProfile, CoupleWithMembers } from '@/types/database.types'

export function useCouple(userId?: string) {
  const [couple, setCouple] = useState<CoupleWithMembers | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCoupleData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      // If user has a couple, get couple data with members
      if (profileData.couple_id) {
        const { data: coupleData, error: coupleError } = await supabase
          .from('couples')
          .select('*')
          .eq('id', profileData.couple_id)
          .single()

        if (coupleError) throw coupleError

        // Get all members of the couple
        const { data: membersData, error: membersError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('couple_id', profileData.couple_id)

        if (membersError) throw membersError

        setCouple({
          ...coupleData,
          members: membersData,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load couple data')
      console.error('Error fetching couple data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupleData()
  }, [userId])

  const createCouple = async (anniversaryDate?: string) => {
    if (!userId) throw new Error('User ID required')

    try {
      // Generate couple code
      const { data: codeData } = await supabase.rpc('generate_couple_code')
      const coupleCode = codeData as string

      // Create couple
      const { data: coupleData, error: coupleError } = await supabase
        .from('couples')
        .insert({
          couple_code: coupleCode,
          anniversary_date: anniversaryDate || null,
        })
        .select()
        .single()

      if (coupleError) throw coupleError

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ couple_id: coupleData.id })
        .eq('id', userId)

      if (updateError) throw updateError

      await fetchCoupleData()
      return coupleData
    } catch (err) {
      throw err
    }
  }

  const joinCouple = async (coupleCode: string) => {
    if (!userId) throw new Error('User ID required')

    try {
      // Find couple by code
      const { data: coupleData, error: findError } = await supabase
        .from('couples')
        .select('*')
        .eq('couple_code', coupleCode)
        .single()

      if (findError) throw new Error('Code de couple invalide')

      // Check if couple already has 2 members
      const { data: membersData } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('couple_id', coupleData.id)

      if (membersData && membersData.length >= 2) {
        throw new Error('Ce couple a déjà 2 membres')
      }

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ couple_id: coupleData.id })
        .eq('id', userId)

      if (updateError) throw updateError

      await fetchCoupleData()
      return coupleData
    } catch (err) {
      throw err
    }
  }

  const leaveCouple = async () => {
    if (!userId) throw new Error('User ID required')

    try {
      // Update user profile to remove couple
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ couple_id: null })
        .eq('id', userId)

      if (updateError) throw updateError

      // Check if couple has any members left
      if (profile?.couple_id) {
        const { data: remainingMembers } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('couple_id', profile.couple_id)

        // If no members left, delete the couple
        if (!remainingMembers || remainingMembers.length === 0) {
          await supabase.from('couples').delete().eq('id', profile.couple_id)
        }
      }

      setCouple(null)
      setProfile({ ...profile!, couple_id: null })
    } catch (err) {
      throw err
    }
  }

  const updateAnniversaryDate = async (date: string) => {
    if (!couple) throw new Error('No couple found')

    try {
      const { error } = await supabase
        .from('couples')
        .update({ anniversary_date: date })
        .eq('id', couple.id)

      if (error) throw error

      await fetchCoupleData()
    } catch (err) {
      throw err
    }
  }

  return {
    couple,
    profile,
    loading,
    error,
    createCouple,
    joinCouple,
    leaveCouple,
    updateAnniversaryDate,
    refetch: fetchCoupleData,
  }
}
