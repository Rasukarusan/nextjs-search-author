import { useState } from 'react'
import { Container, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { Tabs, Title } from './'

export const SheetTotalPage: React.FC = () => {
  const [tab, setTab] = useState('total')
  const router = useRouter()
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
    router.push(`/sheet/${newValue}`)
  }
  return (
    <Container fixed>
      <Title />
      <Box
        sx={{ marginBottom: '16px', borderBottom: 1, borderColor: 'divider' }}
      >
        <Tabs value="total" />
      </Box>
    </Container>
  )
}
