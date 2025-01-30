import { GetServerSideProps } from "next";
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { RoomLayout } from "lyricsify/shared/layouts/RoomLayout";
import { Loader } from "lyricsify/widgets/Loader";
import { roomActions } from "lyricsify/entities/Room/model/slices/roomSlice";
import JOIN_ROOM from "lyricsify/entities/Room/api/gql/join-room.model";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

interface RoomProps {
    roomId: string;
}

const RoomPage = (props: RoomProps) => {
    const { roomId } = props;
    const dispatch = useDispatch();
    const router = useRouter();

    const { data, loading, error } = useQuery(JOIN_ROOM, {
        variables: {
            roomId
        }
    });

    if (loading) {
        return <Loader/>;
    }

    if (error) {
        router.push('/');
        return null;
    }

    if (!data?.joinRoom) {
        router.push('/');
        return null;
    }

    dispatch(roomActions.load(data.joinRoom));

    return (
        <RoomLayout/>
    );
}

export const getServerSideProps: GetServerSideProps<RoomProps> = async (
    context: GetServerSidePropsContext,
): Promise<{ props: RoomProps }> => {
    const { roomId } = context.params as { roomId: string };

    return {
        props: {
            roomId,
        },
    };
};


export default RoomPage;