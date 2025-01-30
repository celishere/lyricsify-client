import {ChangeEvent, useEffect, useRef, useState} from "react";

import { useDebounce } from "use-debounce";

import { useLazyQuery } from "@apollo/client";

import classNames from "classnames";

import { CloseIcon } from "lyricsify/shared/ui/Icons/CloseIcon";

import { IModal } from "../../interfaces/Modal.Interface";

import { SongCard } from "lyricsify/shared/ui/SongCard";

import { SearchSongObjectType } from "lyricsify/shared/api/graphql/generated/graphql";

import SONGS from "lyricsify/entities/Room/api/gql/songs.model";

import { LoaderIcon } from "lyricsify/shared/ui/Icons/LoaderIcon";

import modalCls from "../../modernModal.module.scss";
import cls from "./searchSongModal.module.scss";

export const SearchSongModal = ({ handleCloseModal }: IModal) => {
    const ref = useRef<HTMLInputElement>(null);

    const [typed, setTyped] = useState("");
    const [value] = useDebounce(typed, 400);

    const [songs, setSongs] = useState<SearchSongObjectType[]>([]);

    const [loading, setLoading] = useState(false);

    const [getSongs] = useLazyQuery(SONGS);

    useEffect(() => {
        if (ref) ref.current?.focus();

        setTimeout(() => ref.current?.focus(), 300);
    }, []);

    useEffect(() => {
        if (value.length <= 2) {
            return;
        }

        setLoading(true);

        getSongs({ variables: { query: value }})
            .then(({ data }) => {
                if (data && data.songs) {
                    setLoading(false);

                    setSongs(data.songs);
                }
            });
    }, [getSongs, value]);

    const onType = (e: ChangeEvent<HTMLInputElement>) => setTyped(e.target.value);

    return (
        <>
            <header>
                <div>
                    <a>Поиск</a>

                    <button data-slot="close" onClick={ handleCloseModal }>
                        <CloseIcon />
                    </button>
                </div>
            </header>

            <div className={ classNames(modalCls.modalContent, cls.content) }>
                <div className={ cls.inputBox }>
                    <input
                        ref={ ref }
                        className={ cls.input }
                        placeholder="Введите запрос..."
                        onChange={ onType }
                    />
                </div>

                <div className={ cls.songs }>
                    {
                        loading ? <LoaderIcon/> : (
                            songs.map(song => (
                                <SongCard
                                    key={ `${song.id}-add` }
                                    id={ song.id }
                                    artwork={ song.attributes.artwork.url }
                                    title={ song.attributes.name }
                                    artist={ song.attributes.artistName }
                                    album={ song.attributes.albumName }
                                    adding
                                />
                            ))
                        )
                    }
                </div>
            </div>
        </>
    );
};
