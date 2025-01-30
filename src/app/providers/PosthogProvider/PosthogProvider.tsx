'use client'
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { FC, ReactNode } from "react";

if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always'
    })
}

interface Props {
    children: ReactNode;
}

export const CSPosthogProvider: FC<Props> = ({ children }: Props) => {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}