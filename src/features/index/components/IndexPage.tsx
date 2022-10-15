import { useState } from 'react'
import { Container, Grid } from '@mui/material'
import { Results } from '../types'
import { InputField, Area as ResultArea, CopyField } from './'

export const IndexPage = () => {
  const [searchWords, setTitles] = useState<string[]>([])
  const [results, setResults] = useState<Results>({})

  const updateTitles = (newTitles: string[]) => {
    setTitles(newTitles)
  }

  const updateResults = (newResults: Results) => {
    setResults(newResults)
  }

  return (
    <>
      <Container fixed sx={{ paddingTop: '32px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputField setTitles={updateTitles} setResults={updateResults} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CopyField titles={searchWords} />
          </Grid>
        </Grid>
        <ResultArea results={results} searchWords={searchWords} />
      </Container>
    </>
  )
}
