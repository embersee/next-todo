import Image from 'next/image'
import x from '../../public/assets/x.svg'

const Plus = (props: any) => {
  return (
    <Image width='19px' height='19px' src={x} alt='' className='rotate-45' />
  )
}

export default Plus
