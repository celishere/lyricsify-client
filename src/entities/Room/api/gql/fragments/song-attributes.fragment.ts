import { gql } from "lyricsify/shared/api/graphql/generated";

const SONG_ATTRIBUTES_MODEL = gql(`
    fragment SongAttributesModel on SongAttributesType {
        artistName
        name
        albumName
        durationInMillis
        composerName
        hasLyrics
        videoArtwork
        artwork {
            ...SongArtworkModel 
        }
    }
`)

export default SONG_ATTRIBUTES_MODEL;