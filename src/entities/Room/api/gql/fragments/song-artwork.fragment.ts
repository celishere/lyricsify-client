import { gql } from "lyricsify/shared/api/graphql/generated";

const SONG_ARTWORK_MODEL = gql(`
    fragment SongArtworkModel on SongArtworkType {
       url
       textColor1
       textColor2
       textColor3
       textColor4
       bgColor
    }
`)

export default SONG_ARTWORK_MODEL;