import { gql } from "graphql-tag";

export const query_2 = gql`
  query GetDailyAvarage($sortType: String!) {
    getDailyAvarage(sortType: $sortType) {
      _id {
        custom_id
        dateString
      }
      avarageTotalAmount
    }
  }
`;
