import { homedir } from 'os'
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { NoteContent, NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import * as path from 'node:path'
import { isEmpty } from 'lodash'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`
}

/**
 * 获取所有笔记
 */
export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const notesFileNames = await readdir(rootDir, { encoding: fileEncoding, withFileTypes: false })
  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('未找到笔记文件，创建一个欢迎笔记')
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })
    await writeFile(`${rootDir}/${welcomeNoteFilename}`, content, { encoding: fileEncoding })
    notes.push(`${welcomeNoteFilename}`)
  }

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

/**
 * 根据文件名获取笔记信息
 * @param fileName 文件名
 */
export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)
  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

/**
 * 读取文件
 * @param filename 文件名
 */
export const readNote: ReadNote = async (filename: string) => {
  const rootDir = getRootDir()
  return await readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

/**
 * 保存笔记
 * @param filename 文件名
 * @param content 内容
 */
export const writeNote: WriteNote = async (filename: string, content: NoteContent) => {
  const rootDir = getRootDir()
  console.info(`Writing content to file ${filename}`)
  return await writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

/**
 * 新建笔记
 */
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

/**
 * 删除笔记
 * @param filename 文件名
 */
export const deleteNote: DeleteNote = async (filename: string) => {
  const rootDir = getRootDir()
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '删除笔记',
    message: `确定要删除笔记${filename}?`,
    buttons: ['删除', '取消'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info(`取消删除笔记${filename}`)
    return false
  }

  console.info(`删除笔记${filename}`)
  await remove(`${rootDir}/${filename}.md`)
  return true
}
