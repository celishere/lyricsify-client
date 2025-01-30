import { gql } from "lyricsify/shared/api/graphql/generated";

const SONG_MODEL = gql(`
    fragment SongModel on SongObjectType {
        id
        attributes {
            ...SongAttributesModel
        }
    }
`)

export default SONG_MODEL;