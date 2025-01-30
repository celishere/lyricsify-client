import { gql } from "lyricsify/shared/api/graphql/generated";

const CHANGE_PLAYBACK_STATE_SUBSCRIPTION = gql(`
    subscription changePlaybackStateSubscription($roomId: String!) {
        changePlaybackState(roomId: $roomId) {
            state
            noHost
        }
    }
`);

export default CHANGE_PLAYBACK_STATE_SUBSCRIPTION;