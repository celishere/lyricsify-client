import { gql } from "lyricsify/shared/api/graphql/generated";

const GENERATE_CONNECTION_TOKEN = gql(`
    query GenerateConnectionToken {
        generateConnectionToken
    }
`);

export default GENERATE_CONNECTION_TOKEN;