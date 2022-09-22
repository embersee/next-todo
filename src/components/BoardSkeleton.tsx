export const BoardSkeleton = () => {
  return (
    <div className='flex flex-col mx-2 h-screen opacity-50'>
      <div className='animate-pulse border-2 border-transparent rounded-md dark:bg-night-sky bg-white h-16 w-full px-2 mt-2 flex justify-center items-center '>
        <div className=''>
          <div className='mr-2 inline-flex select-none text-transparent items-center justify-center rounded-md border-2 border-transparent shadow-md px-6 py-2 text-sm font-medium bg-super-silver hover:bg-gray-50 dark:bg-black-velvet dark:hover:bg-absence/50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 '>
            Prioritya
          </div>
          <div className='inline-flex select-none text-transparent items-center justify-center rounded-md border-2 border-transparent shadow-md px-6 py-2 text-sm font-medium bg-super-silver hover:bg-gray-50 dark:bg-black-velvet dark:hover:bg-absence/50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 '>
            Column
          </div>
        </div>
        <div className='flex-auto w-auto'></div>
        <div className='inline-block my-2 px-6 py-2 bg-white dark:bg-black-velvet font-medium text-md text-transparent leading-tight rounded-md shadow-md border-2 border-transparent hover:border-green-500 transition duration-150 ease-in-out'>
          add
        </div>
      </div>
      <div className=' h-full w-full flex justify-center'>
        <div className='animate-pulse h-[56px] w-full border-2 border-transparent bg-white dark:bg-night-sky rounded-md m-2 ml-0'></div>
        {/* {520px if fullsize } */}
        <div className='flex flex-col my-2'>
          <div className=' animate-pulse border-2 bg-white dark:bg-black-velvet dark:border-transparent p-1 mb-2 rounded-md'>
            <div className='h-5 w-5'></div>
          </div>

          <div className='animate-pulse border-2 bg-white dark:bg-black-velvet dark:border-transparent p-1 mb-2 rounded-md'>
            <div className='h-5 w-5'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
