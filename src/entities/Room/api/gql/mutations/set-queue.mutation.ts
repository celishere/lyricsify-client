import { gql } from "lyricsify/shared/api/graphql/generated";

const SET_QUEUE = gql(`
    mutation setQueue($roomId: String!, $queue: String!) {
        setQueue(roomId: $roomId, queue: $queue)
    }
`)

export default SET_QUEUE;