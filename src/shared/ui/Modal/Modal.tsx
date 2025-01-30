import React, {
    RefObject,
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
    MouseEvent,
    cloneElement,
    ReactElement
} from "react";
import { nanoid } from "nanoid";
import classNames from 'classnames';
import Mousetrap from "mousetrap";
import { useOutsideClick } from "lyricsify/shared/lib/hooks/useOutsideClick";
import cls from "./modernModal.module.scss";

interface IModalProps {
    children: ReactNode;
    handleBackgroundClick?: (e: MouseEvent<HTMLDivElement>) => void;
    handleCloseModal?: () => void;
    draggable?: boolean;
    isMini?: boolean;
}

type AdditionalParams = Record<string, any>;

export const Modal = (props: IModalProps & AdditionalParams) => {
    const {
        handleBackgroundClick,
        handleCloseModal,
        draggable,
        isMini,
        children,
        ...additionalParams
    } = props;

    const [modalId, setModalId] = useState(() => `modal-${nanoid(4)}`);
    const [modalOpen, setModalOpen] = useState(true);
    const [animate, setAnimate] = useState(true);

    const modalIdRef = useRef(modalId);

    const dropModal = useCallback(() => {
        setModalOpen(false);
        document.body.classList.remove("modal-open");
    }, []);

    const hookedHandleClose = useCallback(() => {
        dropModal();
        handleCloseModal?.();
    }, [dropModal, handleCloseModal]);

    const modalRef = useOutsideClick(hookedHandleClose);

    useEffect(() => {
        modalIdRef.current = `modal-${nanoid(4)}`;
        setModalId(modalIdRef.current);
        document.body.classList.add("modal-open");

        setTimeout(() => setAnimate(false), 400);

        Mousetrap.bind('esc', hookedHandleClose);

        return () => {
            Mousetrap.unbind('esc');
            hookedHandleClose();
        };
    }, [hookedHandleClose]);


    return (
        <div id="modalContainer">
            {modalOpen && (
                <div
                    id={modalIdRef.current}
                    className={cls.modal}
                    onClick={handleBackgroundClick}
                >
                    <div
                        ref={modalRef}
                        className={classNames(cls.modalForm, animate && cls.open)}
                    >
                        {cloneElement(children as ReactElement, {
                            ...additionalParams,
                            handleCloseModal: hookedHandleClose
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};