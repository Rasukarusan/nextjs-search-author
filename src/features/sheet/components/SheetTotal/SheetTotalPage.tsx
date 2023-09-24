import { useState } from 'react'
import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { Tabs } from '../Tabs'
import { Category, Year } from '../../types'
import { Title } from './Title'
import { Value } from './Value'
import { Rankings } from './Rankings'
import { CategoryMap } from './CategoryMap'
import { YearsGraph } from './YearsGraph'
import { useSession } from 'next-auth/react'

interface Props {
  total: number
  categories: Category[]
  years: Year[]
  sheets: string[]
  username: string
}
export const SheetTotalPage: React.FC<Props> = ({
  total,
  categories,
  years,
  sheets,
  username,
}) => {
  const [tab, setTab] = useState('total')
  const router = useRouter()
  const { data: session } = useSession()
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
    if (session) {
      router.push(`/${session.user.name}/sheets/${newValue}`)
    }
  }
  const average = years.length === 0 ? 0 : Math.ceil(total / years.length)

  return (
    <Container fixed>
      <div className="border-b border-gray-200 mb-8">
        <Tabs value="total" sheets={sheets} username={username} />
      </div>
      <div className="text-center mb-10">
        <Title text="累計読書数" />
        <Value value={total} unit="冊" />
        <div className="w-4/5 h-[300px] m-auto mb-4">
          <CategoryMap categories={categories} />
        </div>

        <Title text="年間平均読書数" />
        <Value value={average} unit="冊" />
        <div className="w-4/5 h-[300px] m-auto mb-4">
          <YearsGraph years={years} />
        </div>

        <Title text="年間ベスト書籍" />
        <Rankings />
      </div>
    </Container>
  )
}
