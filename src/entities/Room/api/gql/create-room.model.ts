import { gql } from "lyricsify/shared/api/graphql/generated";

const CREATE_ROOM = gql(`
    query createRoom {
        createRoom
    }
`)

export default CREATE_ROOM;