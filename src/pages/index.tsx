import Head from "next/head";

import { MainLayout } from "lyricsify/shared/layouts/MainLayout";

const IndexPage = () => {
    return (
        <>
            <Head>
                <title>Lyricsify</title>
            </Head>

            <MainLayout/>
        </>
    )
}

export default IndexPage;