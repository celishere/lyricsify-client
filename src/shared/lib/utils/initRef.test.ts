import { initRef } from './initRef';
import { createRef } from 'react';

describe('initRef', () => {
    it('should call setFunc with the element', () => {
        const setFunc = jest.fn();
        const ref = null;
        const element = document.createElement('div');

        const refCallback = initRef(setFunc, ref);
        refCallback(element);

        expect(setFunc).toHaveBeenCalledTimes(1);
        expect(setFunc).toHaveBeenCalledWith(element);
    });

    it('should call function ref with the element', () => {
        const setFunc = jest.fn();
        const refFunc = jest.fn();
        const element = document.createElement('span');

        const refCallback = initRef(setFunc, refFunc);
        refCallback(element);

        expect(refFunc).toHaveBeenCalledTimes(1);
        expect(refFunc).toHaveBeenCalledWith(element);
    });

    it('should update object ref current with the element', () => {
        const setFunc = jest.fn();
        const refObject = createRef<HTMLParagraphElement>();
        const element = document.createElement('p');

        const refCallback = initRef(setFunc, refObject);
        refCallback(element);

        expect(refObject.current).toBe(element);
    });

    it('should handle null element correctly', () => {
        const setFunc = jest.fn();
        const refFunc = jest.fn();
        const refObject = createRef<HTMLDivElement>();
        const element = null;

        const refCallback = initRef(setFunc, refFunc);
        refCallback(element);

        expect(setFunc).toHaveBeenCalledTimes(1);
        expect(setFunc).toHaveBeenCalledWith(element);
        expect(refFunc).toHaveBeenCalledTimes(1);
        expect(refFunc).toHaveBeenCalledWith(element);
        expect(refObject.current).toBe(element);
    });

    it('should not throw error if ref is null', () => {
        const setFunc = jest.fn();
        const ref = null;
        const element = document.createElement('article');

        const refCallback = initRef(setFunc, ref);
        expect(() => refCallback(element)).not.toThrow();
    });

    it('should not throw error if ref is undefined', () => {
        const setFunc = jest.fn();
        const ref = undefined;
        const element = document.createElement('aside');

        const refCallback = initRef(setFunc, ref as any);
        expect(() => refCallback(element)).not.toThrow();
    });

    it('should work correctly with different HTML element types', () => {
        const setFuncDiv = jest.fn();
        const refObjectDiv = createRef<HTMLDivElement>();
        const divElement = document.createElement('div');
        const refCallbackDiv = initRef(setFuncDiv, refObjectDiv);
        refCallbackDiv(divElement);
        expect(setFuncDiv).toHaveBeenCalledWith(divElement);
        expect(refObjectDiv.current).toBe(divElement);

        const setFuncSpan = jest.fn();
        const refFuncSpan = jest.fn();
        const spanElement = document.createElement('span');
        const refCallbackSpan = initRef(setFuncSpan, refFuncSpan);
        refCallbackSpan(spanElement);
        expect(setFuncSpan).toHaveBeenCalledWith(spanElement);
        expect(refFuncSpan).toHaveBeenCalledWith(spanElement);
    });
});