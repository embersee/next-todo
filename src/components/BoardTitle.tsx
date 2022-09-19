import { Pencil1Icon } from '@radix-ui/react-icons'
import toast from 'react-hot-toast'
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const BoardTitle = ({
  currentTitle,
  textSize,
}: {
  currentTitle: string
  textSize: string
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)

  const router = useRouter()

  const [titleChange, setTitleChange] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const trpcClient = trpc.useContext()

  const { mutate } = trpc.useMutation(['users.titleChange'], {
    onMutate: () => {
      toast.loading('Please wait...', {
        id: 'titleChange',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#1E1E2A
          color: '#fff',
          minWidth: '50px',
        },
      })
    },
    onSuccess: () => {
      toast.success('Title changed', {
        id: 'titleChange',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#22C55E
          color: '#fff',
          minWidth: '50px',
        },
      })
      //trpcClient.invalidateQueries(['users.me'])
      if (router.pathname == '/dashboard') {
        trpcClient.refetchQueries(['users.me'])
      } else {
        trpcClient.refetchQueries(['users.me'])
        trpcClient.refetchQueries(['users.board'])
        router.push(`/boards/${newBoardTitle}`)
      }
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
    if (!newBoardTitle.length || !newBoardTitle.trim()) {
      setNewBoardTitle('')
      setTitleChange((prev) => !prev)
      return
    }
    setTitleChange((prev) => !prev)
    mutate({ old: currentTitle, new: newBoardTitle })
  }

  return (
    <div
      className='flex justify-center'
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {!titleChange ? (
        <>
          <h1
            className={`${textSize} text-center font-bold ml-[28px] my-[2px]`}
          >
            {currentTitle}
          </h1>
        </>
      ) : (
        <form onSubmit={(e) => SubmitBoardTitle(e)}>
          <input
            autoFocus
            type='text'
            className={`dark:bg-night-sky ${textSize} font-bold mx-4 w-[200px] text-center outline-none transition-colors duration-300  ${
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
