import { gql } from "lyricsify/shared/api/graphql/generated";

const JOIN_ROOM = gql(`
    query joinRoom($roomId: String!) {
        joinRoom(roomId: $roomId) {
            ...RoomModel
        }
    }
`);

export default JOIN_ROOM;