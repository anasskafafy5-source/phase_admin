import { supabase } from './supabase.js'

export async function getCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData.session) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) return null
  return data.user
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(error.message)
  return data.user
}

export async function signup({ email, fullName, password }) {
  const { data: currentSessionData } = await supabase.auth.getSession()
  const currentSession = currentSessionData.session
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        avatar: '',
        fullName,
      },
    },
  })

  if (error) throw new Error(error.message)

  if (data.session && currentSession) {
    const { error: restoreError } = await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    })

    if (restoreError) throw new Error(restoreError.message)
  }

  return data.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)
}

export async function updateAccount({ fullName, password }) {
  const updates = { data: { fullName } }

  if (password) updates.password = password

  const { data, error } = await supabase.auth.updateUser(updates)

  if (error) throw new Error(error.message)
  return data.user
}
