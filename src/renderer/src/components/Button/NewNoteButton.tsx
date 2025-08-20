import { ActionButton, ActionButtonProps } from '@/components'
import { LuFilePenLine } from 'react-icons/lu'
import { useSetAtom } from 'jotai'
import { createEmptyNoteAtom } from '@/store'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom)
  const handleCreation = () => {
    createEmptyNote()
  }

  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuFilePenLine className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
