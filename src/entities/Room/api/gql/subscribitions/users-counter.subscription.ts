import { gql } from "lyricsify/shared/api/graphql/generated";

const USERS_COUNTER_SUBSCRIPTION = gql(`
    subscription usersCounter($roomId: String!) {
         userCounter(roomId: $roomId)
    }
`);

export default USERS_COUNTER_SUBSCRIPTION;