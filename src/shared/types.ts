import { NoteInfo } from '@shared/models'

export type GetNotes = () => Promise<NoteInfo[]>
