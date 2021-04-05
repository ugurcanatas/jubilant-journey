import { gql } from "graphql-tag";

export const query_1 = gql`
  query GetLongestTripByDate($date: String!) {
    getLongestTripByDate(date: $date) {
      trip_distance
      PULocationResult {
        Borough
        Zone
        X
        Y
      }
      DOLocationResult {
        Borough
        Zone
        X
        Y
      }
    }
  }
`;
