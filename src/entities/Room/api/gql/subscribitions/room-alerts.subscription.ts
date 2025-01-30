import { gql } from "lyricsify/shared/api/graphql/generated";

const ALERTS_SUBSCRIPTION = gql(`
    subscription alerts($roomId: String!) {
        alert(roomId: $roomId) {
            title
            subtitle
            icon
        }
    }
`);

export default ALERTS_SUBSCRIPTION;