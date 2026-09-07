import React, { createContext, useContext, useState } from 'react'
import type { AuthUser, AuthState } from './types'

interface AuthContextValue extends AuthState {
  login: (user: AuthUser) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const defaultAdminUser: AuthUser = {
  id: 'usr_admin_1',
  name: 'Admin User',
  email: 'admin@antigravity.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  roles: ['super_admin', 'admin'],
  permissions: ['*'], // Super admin has all permissions
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  initialUser = defaultAdminUser,
  children,
}: {
  initialUser?: AuthUser | null
  children: React.ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [isLoading] = useState<boolean>(false)

  const login = (newUser: AuthUser) => {
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes('*')) return true
    if (user.permissions.includes(permission)) return true
    
    // Support wildcard matching e.g. "users.*"
    const [resource] = permission.split('.')
    if (user.permissions.includes(`${resource}.*`)) return true

    return false
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    return user.roles.includes(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const guestAuthContextValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
  hasRole: () => false,
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    return guestAuthContextValue
  }
  return context
}
