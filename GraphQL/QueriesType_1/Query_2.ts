import gql from "graphql-tag";

export const query_2 = gql`
  query Type2($trip_distance: String!) {
    mostTraveledUnder(trip_distance: $trip_distance) {
      total
      _id {
        custom_id
        dateString
      }
      countOfDate
    }
  }
`;
