export interface Appointment {
  id?: number
  patientId: number
  dentistId: number
  date: string
  time: string
  status?: 'pending' | 'confirmed' | 'canceled' | 'attended'
  comment: string
}