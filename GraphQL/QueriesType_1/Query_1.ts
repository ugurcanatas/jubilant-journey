import gql from "graphql-tag";

export const query_1 = gql`
  query Type1 {
    findSumOfPassengers {
      _id {
        custom_id
        dateString
      }
      sumPassengers
    }
  }
`;
