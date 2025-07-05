import '../styles/globals.css'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="3D Animation Generator | AI Video to 3D Animation Converter" />
        <meta property="og:description" content="Transform videos and images into stunning 3D animations with our AI-powered platform. Create 3D cartoon characters, avatars, and animations easily." />
        <meta property="og:site_name" content="3D Animation Generator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="3D Animation Generator | AI Video to 3D Animation Converter" />
        <meta name="twitter:description" content="Transform videos and images into stunning 3D animations with our AI-powered platform. Create 3D cartoon characters, avatars, and animations easily." />
        <link rel="canonical" href="https://your-domain.com" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp 