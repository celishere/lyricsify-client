import { Room } from "lyricsify/entities/Room/model/types/roomSchema";
import { log, LOGGER_COLORS } from "lyricsify/shared/const/logger";
import { RoomType } from "lyricsify/shared/api/graphql/generated/graphql";
import { LyricsMetadata } from "lyricsify/shared/ui/Lyrics/interfaces/LyricsProps.interface";

const FALLBACK_IMAGE = "/fallback.png";
const NO_SONG = 'NO_SONG';

export const isFallback = (data: Room | RoomType) => !data.currentSong || !data.currentSong.attributes;

export const getArtwork = (data: Room) => {
    if (isFallback(data) || !data.currentSong) return FALLBACK_IMAGE;

    return data.currentSong.attributes.artwork.url;
};

export const normalizeId = (id: string | undefined): string => id ?? "";

export const extractArtworkMetadata = (data: Room): { url: string, video?: string } => {
    if (isFallback(data)) return { url: "" };

    const attributes = data.currentSong?.attributes;

    return {
        url: attributes?.artwork.url ?? "",
        video: attributes?.videoArtwork ?? undefined
    };
};

export const extractSongMetadata = (data: Room): { name: string, artist: string, album: string } => {
    if (isFallback(data)) return { name: NO_SONG, artist: "", album: "" };

    const attributes = data.currentSong?.attributes;

    return {
        name: attributes?.name ?? "",
        artist: attributes?.artistName ?? "",
        album: attributes?.albumName ?? "",
    };
};

export const extractDuration = (data: Room) => data.currentSong ? data.currentSong.attributes.durationInMillis / 1000 : 0.0;

export const getUrl = () => `${ process.env.HTTP }://${ process.env.API_URL }`;
export const getAudioUrl = (songId: string) => `${ getUrl() }/api/storage/song/${ songId }`;
export const getLyricsUrl = (songId: string) => `${ getUrl() }/api/storage/song/${ songId }/lyrics`;

export const downloadSong = async (
    id: string,
    url: string,
    onProgress: (percentage: number) => void
): Promise<string> => {
    if (url.length === 0) {
        return "";
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch song: ${ response.status }`);
        }

        const reader = response.body?.getReader();
        const contentLength = Number(response.headers.get('content-length'));
        let receivedLength = 0;
        if (!reader || !contentLength) {
            throw new Error('Cannot read song content');
        }

        const chunks: Blob[] = [];
        let processChunk: any;

        processChunk = ({ done, value }: any) => {
            if (done) {
                const blob = new Blob(chunks, {
                    type: response.headers.get('content-type') || ''
                });

                log("Downloader", LOGGER_COLORS.LightBlue, `Song downloaded and saved in cache. [${ id }]`);

                return URL.createObjectURL(blob);
            }

            if (value) {
                chunks.push(new Blob([value]));
                receivedLength += value.length;
                const percentage = Math.floor((receivedLength / contentLength) * 100);
                onProgress(percentage);
                if (percentage % 10 === 0) log("Downloader", LOGGER_COLORS.White, `Downloading... (${ percentage }%) [${ id }]`);
            }

            return reader.read().then(processChunk);
        }

        return reader.read().then(processChunk);
    } catch (error) {
        log("Downloader", LOGGER_COLORS.Red, `Failed to download the song. [${ id }]`);
        throw error;
    }
};


export const buildLyrics = async (data: Room): Promise<LyricsMetadata | undefined> => {
    if (!data.currentSong) return undefined;

    try {
        const response = await fetch(getLyricsUrl(data.currentSong.id));
        if(!response.ok){
            throw new Error(`Failed to fetch lyrics: ${ response.status }`);
        }
        const jsonData = await response.json();

        log("Downloader", LOGGER_COLORS.White, `Successfully downloaded song lyrics. [${ data.currentSong?.id }]`);
        return jsonData as LyricsMetadata;
    } catch (error) {
        log("Downloader", LOGGER_COLORS.White, `Failed to download song lyrics. [${ data.currentSong?.id }]`);
        return undefined;
    }
}

export const buildChannel = (channel: string, roomId: string) => channel + "_" + roomId;