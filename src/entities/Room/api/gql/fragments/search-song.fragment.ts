import { gql } from "lyricsify/shared/api/graphql/generated";

const SEARCH_SONG_MODEL = gql(`
    fragment SearchSongModel on SearchSongObjectType {
        id
        needInstrumental
        attributes {
            ...SongAttributesModel
        }
    }
`)

export default SEARCH_SONG_MODEL;