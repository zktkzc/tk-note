import { homedir } from 'os'
import { appDirectoryName, fileEncoding } from '@shared/constants'
import { ensureDir, readdir, readFile, stat, writeFile } from 'fs-extra'
import { NoteContent, NoteInfo } from '@shared/models'
import { CreateNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import * as path from 'node:path'

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

export const writeNote: WriteNote = async (filename: string, content: NoteContent) => {
  const rootDir = getRootDir()
  console.info(`Writing content to file ${filename}`)
  return await writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '新建笔记',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: '新建',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('取消新建笔记')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)
  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: '创建失败',
      message: `笔记必须保存在路径${rootDir}下，禁止使用其他目录!`
    })
    return false
  }

  console.info(`新建笔记：${filePath}`)
  await writeFile(filePath, '')
  return filename
}
