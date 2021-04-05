import { gql } from "graphql-tag";

export const query_2 = gql`
  query GetRandomFive($date: String!, $LocationID: Int!) {
    getRandom5(date: $date, LocationID: $LocationID) {
      trip_distance
      lookup_result {
        Borough
        Zone
        LocationID
        X
        Y
      }
    }
  }
`;
