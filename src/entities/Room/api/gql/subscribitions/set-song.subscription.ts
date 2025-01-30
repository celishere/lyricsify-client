import { gql } from "lyricsify/shared/api/graphql/generated";

const SET_SONG_SUBSCRIPTION = gql(`
    subscription setSong($roomId: String!) {
        setSong(roomId: $roomId) {
            song {
                ...SongModel
            }
        }
    }
`);

export default SET_SONG_SUBSCRIPTION;