import gql from "graphql-tag";

export const query_3 = gql`
  query Type3 {
    maxDistanceTrips {
      trip_distance
      tpep_pickup_datetime
      convertedDate
    }
  }
`;
