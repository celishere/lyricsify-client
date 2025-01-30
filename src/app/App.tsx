import { Suspense } from "react";
import type { AppProps } from "next/app";

import Head from "next/head";

import { Loader } from "lyricsify/widgets/Loader";

import { AuthChecker } from "lyricsify/entities/Auth/ui/AuthChecker";
import { ToastProvider } from "lyricsify/app/providers/ToastProvider";
import { PosthogProvider } from "lyricsify/app/providers/PosthogProvider";

const App = (props: AppProps) => {
    const {
        Component,
        pageProps
    } = props;

    return (
        <>
            <Head>
                <meta name="robots" content="all"/>
                <meta name="theme-color" content="#14161A"/>
                <meta name="msapplication-TileColor" content="#14161A"/>
                <link rel="shortcut icon" href="/favicon.ico"/>
            </Head>
            <Suspense fallback={ <Loader /> }>
                <PosthogProvider>
                    <AuthChecker>
                        <ToastProvider>
                            <Component {...pageProps} />
                        </ToastProvider>
                    </AuthChecker>
                </PosthogProvider>
            </Suspense>
        </>
    )
};

export default App;