import { gql } from "lyricsify/shared/api/graphql/generated";

const CREATE_SESSION = gql(`
    query createSession {
        createSession
    }
`)

export default CREATE_SESSION;