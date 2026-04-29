// hooks/useAuth.js
"use client"

import { useEffect, useState } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user")
        if (!res.ok) throw new Error("Failed to fetch user")

        const data = await res.json()
        if (isMounted) setUser(data)
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [])

  return { user, loading, error }
}