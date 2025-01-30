import Image from "next/image";

import cls from "./ErrorPage.module.scss";

export const ErrorPage = () => {
    const reloadPage = () => location.reload();

    return (
        <div className={ cls.ErrorPage } data-testid="error-page">
            <Image
                src="https://emojicdn.elk.sh/%F0%9F%98%B5"
                alt="error emoji"
                width={ 60 }
                height={ 60 }
            />

            <div>
                <a>Ой!</a>
                <p>Произошла ошибка</p>
            </div>

            <button onClick={ reloadPage }>
                Обновить страницу
            </button>
        </div>
    )
}