import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";

import cls from "./Loader.module.scss";

export const Loader = () => {
    return (
        <div className={ cls.Loader }>
            <LoaderIcon/>
        </div>
    )
}