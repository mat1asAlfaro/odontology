export interface User {
  id?: number
  firstName: string
  lastName: string
  email: string
  password?: string
  role: 'admin' | 'patient' | 'dentist'
  phone?: string | null
  status?: boolean
  createdAt?: Date
}