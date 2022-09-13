import { Dispatch, SetStateAction, useState } from 'react'

import { Pencil1Icon } from '@radix-ui/react-icons'
import { trpc } from '../utils/trpc'

export const BoardTitle = ({ currentTitle }: { currentTitle: string }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)

  const [titleChange, setTitleChange] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const trpcClient = trpc.useContext()

  const { mutate } = trpc.useMutation(['users.titleChange'], {
    onSuccess: () => {
      trpcClient.invalidateQueries(['users.me'])
      // trpcClient.refetchQueries(['users.me'])
    },
  })

  const handleMouseOver = () => setIsHovering(true)
  const handleMouseOut = () => setIsHovering(false)

  const titleHandler = () => setTitleChange((prev) => !prev)
  const titleChanger = (input: string) => setNewBoardTitle(input)

  const blurHandler = () => {
    setIsFocus(false)
    setIsBlur(true)
  }
  const focusHandler = () => {
    setIsFocus(true)
    setIsBlur(false)
  }

  const SubmitBoardTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault
    if (newBoardTitle === '') return
    setTitleChange((prev) => !prev)
    mutate({ old: currentTitle, new: newBoardTitle })
  }

  return (
    <div
      className='flex justify-center mx-auto'
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {!titleChange ? (
        <>
          <h1 className='text-xl text-center font-bold ml-[28px] my-[2px]'>
            {currentTitle}
          </h1>
        </>
      ) : (
        <form onSubmit={(e) => SubmitBoardTitle(e)}>
          <input
            autoFocus
            type='text'
            className={`dark:bg-night-sky text-xl font-bold w-full text-center outline-none transition-colors duration-300  ${
              isFocus
                ? 'border-2 rounded-md border-orange-500'
                : isBlur
                ? 'border-2 rounded-md border-rose-500'
                : ''
            }`}
            value={newBoardTitle}
            onChange={(e) => titleChanger(e.target.value)}
            onFocus={focusHandler}
            onBlur={blurHandler}
            placeholder={currentTitle || 'Board name...'}
          />
        </form>
      )}
      <button
        onClick={titleHandler}
        className={`ml-2 transition-opacity ${
          isHovering ? 'opacity-100' : 'opacity-0'
        } ${!titleChange ? 'block' : 'hidden'}`}
      >
        <Pencil1Icon className='h-5 w-5' />
      </button>
    </div>
  )
}
