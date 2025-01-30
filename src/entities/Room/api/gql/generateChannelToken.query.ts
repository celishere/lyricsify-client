import { gql } from "lyricsify/shared/api/graphql/generated";

const GENERATE_CHANNEL_TOKEN = gql(`
    query GenerateChannelToken($channelId: String!) {
        generateChannelToken(channel: $channelId)
    }
`);

export default GENERATE_CHANNEL_TOKEN;