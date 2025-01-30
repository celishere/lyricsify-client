import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";

const ProblematicComponent = () => {
    throw new Error("Test error");
};

describe("ErrorBoundary", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    test("should display ErrorPage when a child component throws an error", () => {
        render(
            <ErrorBoundary>
                <ProblematicComponent />
            </ErrorBoundary>
        );

        expect(screen.getByTestId("error-page")).toBeInTheDocument();
    });

    test("should render child component if no error occurs", () => {
        render(
            <ErrorBoundary>
                <div data-testid="child-component">Works</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId("child-component")).toBeInTheDocument();
    });
});
