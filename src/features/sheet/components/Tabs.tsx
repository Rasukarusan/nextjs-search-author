import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface Props {
  sheets: string[]
  value: string
  username: string
}
export const Tabs: React.FC<Props> = ({ value, sheets, username }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState(value)

  const onClick = (value: string) => {
    setTab(value)
    router.push(`/${username}/sheets/${value}`)
  }

  return (
    <div className="no-scrollbar flex items-center justify-start overflow-x-auto">
      {['total', ...sheets].map((sheet) => (
        <button
          key={sheet}
          className={`whitespace-nowrap px-8 py-3 text-center text-sm uppercase text-gray-600 duration-300 ease-in hover:bg-gray-100 ${
            tab === sheet ? 'border-b-2 border-gray-900' : ''
          }`}
          onClick={() => onClick(sheet)}
        >
          {sheet}
        </button>
      ))}
    </div>
  )
}
