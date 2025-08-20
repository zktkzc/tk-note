import { ElectronAPI } from '@electron-toolkit/preload'
import { GetNotes } from '../shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: GetNotes
    }
  }
}
