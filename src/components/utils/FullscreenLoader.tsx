import Spinner from './Spinner'

const FullScreenLoader = () => {
  return (
    <div className='w-full h-full fixed bg-transparent flex-grow'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3'>
        <Spinner width={8} height={8} />
      </div>
    </div>
  )
}

export default FullScreenLoader
