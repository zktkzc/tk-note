import { DeleteNoteButton } from '@/components/Button/DeleteNoteButton'
import { ComponentProps } from 'react'
import { NewNoteButton } from '@/components'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
    </div>
  )
}
