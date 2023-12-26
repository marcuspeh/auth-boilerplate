import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return (<>
        <Head>
            <title>Hello World</title>
        </Head>
    <Component {...pageProps} />
    </>)
}

export default MyApp
