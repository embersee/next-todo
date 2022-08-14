import Image from 'next/image'
import x from '../../public/assets/x.svg'

const Plus = (props: any) => {
  return <Image width={19} height={19} src={x} alt='' className='rotate-45' />
}

export default Plus
