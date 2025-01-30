import { gql } from "lyricsify/shared/api/graphql/generated";

const ROOM_MODEL = gql(`
    fragment RoomModel on RoomType {
        id
        host
        state
        participants
        hostTime
        isHost
        currentSong {
            ...SongModel
        }
        songList {
            ...SongModel
        }
        queue {
            ...QueueSongModel
        }
    }
`)

export default ROOM_MODEL;