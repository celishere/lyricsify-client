import { gql } from "lyricsify/shared/api/graphql/generated";

const SONGS = gql(`
    query songs($query: String!) {
        songs(query: $query) {
            ...SearchSongModel
        }
    }
`);

export default SONGS;