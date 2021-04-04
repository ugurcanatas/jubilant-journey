import { gql } from "graphql-tag";

export const query_1 = gql`
  query GetSpesificLocation(
    $LocationID: Int!
    $date_start: String!
    $date_end: String!
  ) {
    getSpesificLocation(
      LocationID: $LocationID
      date_start: $date_start
      date_end: $date_end
    ) {
      _id
      countOfVehicles
      lookup_result {
        Borough
        Zone
        LocationID
        service_zone
      }
    }
  }
`;
