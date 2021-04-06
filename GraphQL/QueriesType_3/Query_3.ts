import { gql } from "graphql-tag";

export const query_3 = gql`
  query GetMin3Passengers($passenger_count: Int) {
    getMin3Passengers(passenger_count: $passenger_count) {
      PULocationID
      passenger_count
      min
      max
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
