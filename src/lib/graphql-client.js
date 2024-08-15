import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:9000/graphql';

export const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: '',
    },
});