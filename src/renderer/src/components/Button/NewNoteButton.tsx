import { ActionButton, ActionButtonProps } from '@/components'
import { LuFilePenLine } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  return (
    <ActionButton {...props}>
      <LuFilePenLine className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
