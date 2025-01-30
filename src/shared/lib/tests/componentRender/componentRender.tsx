/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";

import { ReactNode } from "react";

import { StateSchema, StoreProvider } from "src/app/providers/StoreProvider";

export interface componentRenderOptions {
    initialState?: Partial<StateSchema>;
}

export function componentRender(component: ReactNode, options: componentRenderOptions = {}) {
    const { initialState } = options;

    return render(
        <StoreProvider initialState={ initialState }>
            { component }
        </StoreProvider>
    )
}