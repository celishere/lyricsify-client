import { gql } from "lyricsify/shared/api/graphql/generated";

const SET_QUEUE_SUBSCRIPTION = gql(`
    subscription setQueueSubscription($roomId: String!) {
        setQueue(roomId: $roomId) {
            ...QueueSongModel
        }
    }
`);

export default SET_QUEUE_SUBSCRIPTION;