import { homedir } from 'os'
import { appDirectoryName, fileEncoding } from '@shared/constants'
import { ensureDir, readdir, readFile, stat } from 'fs-extra'
import { NoteInfo } from '@shared/models'
import { GetNotes, ReadNote } from '@shared/types'

export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const notesFileNames = await readdir(rootDir, { encoding: fileEncoding, withFileTypes: false })
  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))
  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)
  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename: string) => {
  const rootDir = getRootDir()
  return await readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}
