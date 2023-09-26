import useSWR from 'swr'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Grid, Box, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Container } from '@/components/layout/Container'
import { Record } from '../types'
import { BarGraph } from './BarGraph'
import { Tabs } from './Tabs'
import { Books } from './Books'
import { BookRows } from './BookRows'
import GridViewIcon from '@mui/icons-material/GridView'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { fetcher } from '@/libs/swr'
import { useSession } from 'next-auth/react'
import { YearlyTopBook } from '@/types/book'
import { YearlyTopBooks } from './YearlyTopBooks'
import { TitleWithLine } from '@/components/label/TitleWithLine'
import { CoutUpText } from '@/components/label/CountUpText'

const TreemapGraph = dynamic(
  () => import('./TreemapGraph').then((mod) => mod.TreemapGraph),
  { ssr: false }
)

interface Props {
  data: Record[]
  year: string
  sheets: string[]
  username: string
  yearlyTopBooks: YearlyTopBook[]
}

export const SheetPage: React.FC<Props> = ({
  data,
  year,
  sheets,
  username,
  yearlyTopBooks,
}) => {
  const { data: session } = useSession()
  // アクセスしているページが自分のページの場合、非公開メモも表示したいためクライアント側で改めて本データを取得する
  const { data: res } = useSWR(`/api/books/${year}`, fetcher, {
    fallbackData: { result: true, books: data },
  })
  const [currentData, setCurrentData] = useState<Record[]>(data)
  const [open, setOpen] = useState(false)
  // 一覧表示か書影表示か
  const [mode, setMode] = useState<'row' | 'grid'>('grid')

  useEffect(() => {
    const isMine =
      data.length > 0 && session && session.user.id === data[0].userId
    if (isMine) {
      setCurrentData(res.books)
    } else {
      setCurrentData(data)
    }
  }, [res, session, data])

  const setShowData = (newData: Record[]) => {
    setCurrentData(newData)
  }

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'row' | 'grid'
  ) => {
    setMode(newMode)
  }

  if (data.length === 0) {
    return (
      <Container>
        <div className="border-b border-gray-200 mb-8">
          <Tabs sheets={sheets} value={year} username={username} />
        </div>
        <div className="p-10 text-center">
          <div className="text-4xl font-bold mb-4">データがまだありません</div>
          <img src="/no-image.png" alt="" width="400" className="m-auto" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="mb-12">
      <div className="border-b border-gray-200 mb-8">
        <Tabs sheets={sheets} value={year} username={username} />
      </div>
      <div className="text-center mb-10">
        <TitleWithLine text="累計読書数" />
        <CoutUpText value={data.length} unit="冊" step={1} />
      </div>
      <YearlyTopBooks
        books={data}
        year={year}
        yearlyTopBooks={yearlyTopBooks}
      />
      <Box
        sx={{
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={6} md={6}>
            <BarGraph records={data} setShowData={setShowData} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TreemapGraph records={data} setShowData={setShowData} />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <ToggleButtonGroup
          color="standard"
          value={mode}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="grid">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="row">
            <TableRowsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {mode === 'grid' ? (
        <Books books={currentData} />
      ) : (
        <BookRows books={currentData} />
      )}
    </Container>
  )
}
