import { gql } from "lyricsify/shared/api/graphql/generated";

const PREV_SONG = gql(`
    mutation prevSong($roomId: String!) {
        prevSong (roomId: $roomId) {
            ...SongModel
        }
    }
`)

export default PREV_SONG;