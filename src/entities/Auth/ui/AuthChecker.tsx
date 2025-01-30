import { useDispatch } from "react-redux";
import { FC, ReactNode, useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Loader } from "lyricsify/widgets/Loader";
import { useLazyQuery } from "@apollo/client";
import { authActions } from "src/entities/Auth/model/slice/authSlice";
import CREATE_SESSION from "lyricsify/entities/Auth/api/gql/create-session.model";

type AuthCheckerProps = {
    children: ReactNode
};

export const AuthChecker: FC<AuthCheckerProps> = (props) => {
    const { children } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [profile, { error: queryError }] = useLazyQuery(CREATE_SESSION,
        {
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        }
    );
    const dispatch = useDispatch();
    const posthog = usePostHog();

    useEffect(() => {
        setIsLoading(true);
        profile()
            .then(res => {
                const { data } = res;
                if (!data) {
                    throw new Error('No data returned from session');
                }
                dispatch(authActions.authenticate());
                posthog.capture('auth_success');
            })
            .catch(err => {
                setError(err);
                posthog.capture('auth_failed', { error: err.message });
                dispatch(authActions.deAuthenticate());
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    useEffect(() => {
        if (queryError) {
            setError(queryError);
            posthog.capture('auth_query_failed', { error: queryError.message });
            dispatch(authActions.deAuthenticate());
        }
    }, [queryError]);

    if(error){
        return <div> Error: {error?.message || 'Unknown error' }</div>;
    }

    return isLoading ? <Loader/> : children;
}