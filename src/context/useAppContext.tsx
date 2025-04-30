"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AppContext = createContext({
  isAuthenticated: false,
  userId: "",
  tokenValue: "",
  setIsAuthenticated: (value: boolean) => {},
  setTokenValue: (value: string) => {}
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState("")
  const [tokenValue, setTokenValue] = useState("")

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=")
        acc[key] = value
        return acc
      },
      {} as Record<string, string>
    )

    const token = cookies["token"]
    const userId = cookies["userId"]

    if (token) {
      setIsAuthenticated(true)
      setTokenValue(token)

      setUserId(userId || "")
    }
  }, [])
  return (
    <AppContext.Provider
      value={{ isAuthenticated, userId, tokenValue, setIsAuthenticated, setTokenValue }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
