import { gql } from "lyricsify/shared/api/graphql/generated";

const CURRENT_TIME_UPDATE_SUBSCRIPTION = gql(`
    subscription updateCurrentTimeSubscription($roomId: String!) {
        updateCurrentTime(roomId: $roomId)
    }
`);

export default CURRENT_TIME_UPDATE_SUBSCRIPTION;