import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes } from '@shared/types'

if (!process.contextIsolated) {
  throw new Error('必须在创建窗口时开启上下文隔离选项(contextIsolated).')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args)
  })
} catch (error) {
  console.error(error)
}
