import { gql } from "lyricsify/shared/api/graphql/generated";

const NEXT_SONG = gql(`
    mutation nextSong($roomId: String!) {
        nextSong(roomId: $roomId) {
            ...SongModel
        }
    }
`)

export default NEXT_SONG;