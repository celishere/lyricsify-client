export interface SongsSchema {
    blobCache: { [id: string]: string };
    cacheQueue: { [id: string]: number };
}