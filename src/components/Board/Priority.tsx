export const Priority = ({ prio }: { prio: string }) => {
  let colour: string
  switch (prio) {
    case 'high':
      colour = 'bg-red-500'
      break
    case 'medium':
      colour = 'bg-yellow-500'
      break
    case 'low':
      colour = 'bg-green-500'
      break
    default:
      colour = ''
      break
  }
  return (
    <div className={`h-[28px] w-1 ${colour} rounded-md mr-2 flex-grow-0`}></div>
  )
}
