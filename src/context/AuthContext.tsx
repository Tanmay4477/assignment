// "use client"

// import React, { createContext, useContext, useEffect, useState } from 'react'
// import supabase from '../utils/supabaseClient'
// import { Session, User } from '@supabase/supabase-js'

// // Define the type for the context
// type AuthContextType = {
//   user: User | null
//   session: Session | null
//   isLoading: boolean
//   signUp: (email: string, password: string) => Promise<void>
//   signIn: (email: string, password: string) => Promise<void>
//   signOut: () => Promise<void>
// }

// // Create the context with undefined as default value
// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // Create the provider component
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [session, setSession] = useState<Session | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Check active sessions and sets the user
//     const setData = async () => {
//       const { data: { session }, error } = await supabase.auth.getSession()
//       if (error) {
//         console.log(error)
//         setIsLoading(false)
//         return
//       }
//       if (session) {
//         setSession(session)
//         setUser(session.user)
//       }
//       setIsLoading(false)
//     }

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//       setUser(session?.user ?? null)
//       setIsLoading(false)
//     })

//     setData()

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   const signUp = async (email: string, password: string) => {
//     setIsLoading(true)
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     })

//     if (error) {
//       throw error
//     }
//   }

//   const signIn = async (email: string, password: string) => {
//     setIsLoading(true)
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
    
//     if (error) {
//       throw error
//     }
//   }

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (error) {
//       throw error
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// // Create a hook to use the auth context
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }