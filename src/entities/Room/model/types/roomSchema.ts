import { Maybe, PlaybackState, QueueSongType, SongObjectType } from "lyricsify/shared/api/graphql/generated/graphql";

export interface RoomSchema {
    data: Room;
}

export interface Room {
    id?: string;
    host?: string;
    state: PlaybackState;
    participants: string[];
    hostTime: number;
    isHost: boolean;
    currentSong?: Maybe<SongObjectType> | undefined;
    songList: SongObjectType[];
    queue: QueueSongType[];
    toolbarActive: boolean;
    fullscreen: boolean;
    lyricsEmpty: boolean;
    lyricsEnabled: boolean;
}