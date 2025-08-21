import { ElectronAPI } from '@electron-toolkit/preload'
import { GetNotes, ReadNote } from '../shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
    }
  }
}
