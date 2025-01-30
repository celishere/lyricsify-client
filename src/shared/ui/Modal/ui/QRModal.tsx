import classNames from 'classnames';

import QRCode from "qrcode.react";

import { CloseIcon } from "lyricsify/shared/ui/Icons/CloseIcon";

import { IModal } from "../interfaces/Modal.Interface";

import modalStyles from "../modernModal.module.scss";

export const QRModal = ({ handleCloseModal }: IModal) => {
    return (
        <div className={modalStyles.modalForm}>
            <header>
                <div>
                    <a>QR-код</a>

                    <button data-slot="close" onClick={ handleCloseModal }>
                        <CloseIcon />
                    </button>
                </div>
            </header>

            <div className={ classNames(modalStyles.modalContent) }>
                <QRCode
                    value={ location.href }
                    renderAs="svg"
                    size={ 512 }
                    bgColor="transparent"
                    fgColor="rgba(255, 255, 255, 0.75)"
                />
            </div>
        </div>
    );
};
