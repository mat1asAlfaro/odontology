export interface MedicalHistory {
  id: number
  patientId: number
  dentistId: number
  date: Date
  diagnostic: string
  treatmentPerformed: string
  observations: string
}