import { ReactNode, useEffect, useRef, useState } from 'react'
import { a, animated, useSpring } from '@react-spring/web'

import { PlusIcon } from '@radix-ui/react-icons'
import styled from 'styled-components'
import useMeasure from 'react-use-measure'

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  overflow: hidden;
`
//DOESNT WORK WITH TAILWIND SO NEED TO USE ~styled-compnents~ thanks i hate it here
type WithChildren<T = {}> = T & { children?: ReactNode }

type TreeProps = WithChildren<{
  isOpen?: boolean
}>

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

export const Tree = ({ isOpen, children }: TreeProps) => {
  const previous = usePrevious(isOpen)
  const [ref, { height: viewHeight }] = useMeasure()
  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  })
  return (
    <div>
      {/* <PlusIcon onClick={() => setOpen(!isOpen)} /> */}
      <Content
        style={{
          opacity: opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <a.div ref={ref}>{children}</a.div>
      </Content>
    </div>
  )
}
