import { gql } from "lyricsify/shared/api/graphql/generated";

const FETCH_SONG = gql(`
    query fetchSong($songId: String!) {
        song(id: $songId)
    }
`)

export default FETCH_SONG;