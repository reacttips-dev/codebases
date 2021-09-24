import gql from 'graphql-tag';
export const PRICE_FRAGMENT = gql `
  fragment PriceFragment on Price {
    currency
    formattedValue
    value
    __typename
  }
`;
export const PLAN_FRAGMENT = gql `
  fragment PlanFragment on Plan {
    __typename
    createdAt
    endDate
    extendable
    memberCapacity
    name
    renewDate
    renewalType
    seatCapacity
    startDate
    trial
  }
`;
export const BILLING_DETAILS = gql `
  query billingDetails {
    billingDetails {
      address {
        city
        country
        postalCode
        state
        streetAddress
      }
      billingEmail
      card {
        expirationMonth
        expirationYear
        lastFourDigits
        updatedAt
      }
      companyName
      vat {
        text
        vatId
        vatType
      }
      __typename
    }
  }
`;
export const BASKETS = gql `
  query baskets($input: BasketsInput!) {
    baskets(input: $input) {
      items {
        note
        title
        value {
          ...PriceFragment
        }
        __typename
      }
      renewalType
      total {
        ...PriceFragment
      }
    }
  }
  ${PRICE_FRAGMENT}
`;
export const ADDITIONAL_SEATS = gql `
  query additionalSeats($input: AdditionalSeatsInput!) {
    additionalSeats(input: $input) {
      newSeats
      seats {
        additionalFee {
          ...PriceFragment
        }
        capacity
        declared
        __typename
      }
      total {
        ...PriceFragment
      }
    }
  }
  ${PRICE_FRAGMENT}
`;
export const PURCHASE = gql `
  mutation purchase($input: PurchaseInput!) {
    purchase(input: $input) {
      __typename
      createdAt
      id
      status
      updatedAt
    }
  }
`;
export const VAT_TYPES = gql `
  query vatTypes {
    vatTypes {
      key
      placeholder
      text
      value
    }
  }
`;
//# sourceMappingURL=billing.gql.js.map