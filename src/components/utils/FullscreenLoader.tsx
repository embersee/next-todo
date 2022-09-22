import Spinner from './Spinner'

const FullScreenLoader = () => {
  return (
    <div className='w-full h-full bg-transparent'>
      <div className='relative top-1/4 left-1/2 '>
        <Spinner width={8} height={8} />
      </div>
    </div>
  )
}

export default FullScreenLoader
