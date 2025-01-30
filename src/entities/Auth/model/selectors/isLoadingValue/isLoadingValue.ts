import { createSelector } from "reselect";

import { getAuth } from "../getAuth";
import { AuthSchema } from "../../types/authSchema";

export const isLoadingValue = createSelector(
    getAuth,
    (auth: AuthSchema) => auth.isLoading
);