import { gql } from "lyricsify/shared/api/graphql/generated";

const QUEUE_SONG_MODEL = gql(`
    fragment QueueSongModel on QueueSongType {
        id
        queueId
        attributes {
            ...SongAttributesModel
        }
    }
`)

export default QUEUE_SONG_MODEL;