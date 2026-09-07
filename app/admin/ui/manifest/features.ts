export interface AdminFeatures {
  table: boolean
  forms: boolean
  upload: boolean
  charts: boolean
  commandPalette: boolean
  datePicker: boolean
  richEditor: boolean
  notifications: boolean
}

export const defaultFeatures: AdminFeatures = {
  table: true,
  forms: true,
  upload: false,
  charts: true,
  commandPalette: true,
  datePicker: true,
  richEditor: false,
  notifications: true,
}
