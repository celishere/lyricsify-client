import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import App from "lyricsify/app/App";

import createApolloClient from "lyricsify/shared/api/graphql/ApolloClient";

import { ErrorBoundary } from "lyricsify/app/providers/ErrorBoundary";
import { StoreProvider } from "lyricsify/app/providers/StoreProvider";

import "../app/styles/index.scss";

export default function NextApp(props: AppProps) {
    const apolloClient = createApolloClient();

    return (
        <ApolloProvider client={ apolloClient }>
            <StoreProvider>
                <ErrorBoundary>
                    <App {...props} />
                </ErrorBoundary>
            </StoreProvider>
        </ApolloProvider>
    )
}
