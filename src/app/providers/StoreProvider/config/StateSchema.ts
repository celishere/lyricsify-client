import { AuthSchema } from "lyricsify/entities/Auth/model/types/authSchema";
import { RoomSchema } from "lyricsify/entities/Room/model/types/roomSchema";
import { PlayerSchema } from "lyricsify/entities/Player/model/types/playerSchema";
import { SongsSchema } from "lyricsify/entities/Song/model/types/songsSchema";

export interface StateSchema {
  auth: AuthSchema;
  room: RoomSchema;
  player: PlayerSchema;
  songs: SongsSchema;
}
