import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'
import { Header, Footer } from '@/features/global'
import { LoadingTopBar } from '@/features/global/components/LoadingTopBar'
import { RecoilRoot } from 'recoil'
import { DefaultSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import './global.css'
import { RecoilEnv } from 'recoil'
import { SessionProvider } from 'next-auth/react'
import { Layout } from '@/components/layout/Layout'

// Expectation Violation: Duplicate atom keyをログに出力させないための設定
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

export default function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <DefaultSeo {...SEO} />
      <RecoilRoot>
        <SessionProvider session={pageProps.session}>
          <LoadingTopBar />
          <Layout>
            <Header />
            <Component {...pageProps} />
            <Analytics />
          </Layout>
          <Footer />
        </SessionProvider>
      </RecoilRoot>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
