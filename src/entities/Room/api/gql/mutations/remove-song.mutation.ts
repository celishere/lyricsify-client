import { gql } from "lyricsify/shared/api/graphql/generated";

const REMOVE_SONG = gql(`
    mutation removeSong($roomId: String!, $queueId: String!) {
        removeSong(roomId: $roomId, queueId: $queueId)
    }
`)

export default REMOVE_SONG;