import { gql } from "graphql-tag";

export const query_3 = gql`
  query GetMinDistanceTrips($date_first: String!, $date_second: String!) {
    getMinDistanceTrips(date_first: $date_first, date_second: $date_second) {
      tpep_pickup_datetime
      trip_distance
      tpep_dropoff_datetime
      startDate
      endDate
    }
  }
`;
