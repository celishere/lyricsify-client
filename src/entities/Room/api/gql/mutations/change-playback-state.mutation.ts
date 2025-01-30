import { gql } from "lyricsify/shared/api/graphql/generated";

const CHANGE_PLAYBACK_STATE = gql(`
    mutation changePlaybackState($roomId: String!, $state: Float!) {
        changePlaybackState(roomId: $roomId, state: $state)
    }
`)

export default CHANGE_PLAYBACK_STATE;