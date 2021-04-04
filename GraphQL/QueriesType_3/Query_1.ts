import { gql } from "graphql-tag";

export const query_1 = gql`
  query GetLongestTripByDate($date: String!) {
    getLongestTripByDate(date: $date) {
      trip_distance
      lookup_result {
        Borough
        Zone
        X
        Y
      }
    }
  }
`;
