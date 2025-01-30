import { gql } from "lyricsify/shared/api/graphql/generated";

const ADD_SONG = gql(`
    mutation addSong($roomId: String!, $songId: String!) {
        addSong(roomId: $roomId, songId: $songId) {
            id
        }
    }
`)

export default ADD_SONG;