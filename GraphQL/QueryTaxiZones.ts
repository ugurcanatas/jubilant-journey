import gql from "graphql-tag";

export const GetTaxiZones = gql`
query GetTaxiZones {
  getLocations {
    LocationID
    Borough
    Zone
    service_zone
  }
}
`;