import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('必须在创建窗口时开启上下文隔离选项(contextIsolated).')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language
  })
} catch (error) {
  console.error(error)
}
