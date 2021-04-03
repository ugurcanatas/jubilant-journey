import gql from 'graphql-tag';

export const queryCardsLayout = gql`
    query GetCardLayout {
        getCardsLayout {
            custom_field_id,
            title,
            items {
                title,
                excerpt,
                toOnClick
            }
        }
    }
`;