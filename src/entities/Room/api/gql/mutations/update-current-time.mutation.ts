import { gql } from "lyricsify/shared/api/graphql/generated";

const UPDATE_CURRENT_TIME = gql(`
    mutation updateCurrentTime($roomId: String!, $time: Float!) {
        updateCurrentTime(roomId: $roomId, time: $time)
    }
`)

export default UPDATE_CURRENT_TIME;