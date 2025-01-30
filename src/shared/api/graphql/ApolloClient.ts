import {
    split,
    ApolloClient,
    InMemoryCache,
    ApolloLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { log, LOGGER_COLORS } from "lyricsify/shared/const/logger";

// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';

const path = 'api/graphql';

const httpLink = new createUploadLink({
    uri: `${ process.env.HTTP }://${ process.env.API_URL }/${ path }`,
    credentials: "include",
});

const createApolloClient = () => {
    if (!process.browser) return null;

    let activeSocket: WebSocket;
    const wsClient = createClient({
        url: `${ process.env.WS }://${ process.env.API_URL }/${ path }`,
        lazy: true,
        shouldRetry: (): boolean => true,
        on: {
            connected: (socket) => {
                activeSocket = socket as WebSocket;
            },
            closed: () => log('Transport', LOGGER_COLORS.Red, 'Closed'),
            error: async (error) => {
                if (String(error).includes("Unauthorized")) {
                    wsClient?.terminate();
                    if (activeSocket.readyState !== WebSocket.CLOSING && activeSocket.readyState !== WebSocket.CLOSED) {
                        activeSocket.send("CLOSE");
                        activeSocket.close();
                    }
                }
            }
        }
    });

    const wsLink = new GraphQLWsLink(wsClient);

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);

            return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            );
        },
        wsLink,
        httpLink
    );

    return new ApolloClient({
        link: ApolloLink.from([splitLink]),
        cache: new InMemoryCache(),
        credentials: 'include',
        name: 'lyricsify-client',
        ssrMode: typeof window === "undefined",
        ssrForceFetchDelay: typeof window === "undefined" ? 100 : 0,
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network",
                nextFetchPolicy: "cache-first",
                errorPolicy: "all",
            },
            query: {
                errorPolicy: "all",
            },
            mutate: {
                errorPolicy: "all",
            },
        },
    });
};

export default createApolloClient;