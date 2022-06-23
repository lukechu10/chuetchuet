import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    avatar: String
    biography: String
    isSeller: Boolean!
    isAdmin: Boolean!
    email: String!
    emailVerified: Boolean!
    passwordHash: String!
    phoneNumber: String
    address: String
  }

  enum Unit {
    bucket
  }

  type Product {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    coverImage: String!
    images: [String!]!
    sellerPrice: Float!
    buyerPrice: Float!
    unit: Unit!
  }

  type BasketProduct {
    product: Product!
    quantity: Int!
  }

  input BasketProductInput {
    productId: ID!
    quantity: Int!
  }

  type Basket {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    coverImage: String!
    images: [String!]!
    buyerPrice: Float!
    products: [BasketProduct!]!
  }

  enum ProductOfferStatus {
    pendingPickup
    shipping
    atRelayPoint
  }

  type ProductOffer {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    product: Product!
    quantity: Int!
    status: ProductOfferStatus!
  }

  enum OrderStatus {
    inCart
    atRelayPoint
    complete
    canceled
  }

  type Order {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    product: Product!
    pickupLocation: String!
    quantity: Int!
    status: OrderStatus!
  }

  type Review {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    owner: User!
    orders: [Order!]!
    rating: Int!
    description: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    user(id: ID!): User
    users: [User!]!
    product(id: ID!): Product
    products: [Product!]!
    basket(id: ID!): Basket
    baskets: [Basket!]!
    productOffer(id: ID!): ProductOffer
    productOffers: [ProductOffer!]!
    order(id: ID!): Order
    orders: [Order!]!
    review(id: ID!): Review
    reviews: [Review!]!
  }

  type Mutation {
    addUser(
      createdAt: Date!
      updatedAt: Date!
      name: String!
      avatar: String
      biography: String
      isSeller: Boolean!
      email: String!
      passwordHash: String!
      phoneNumber: String
      address: String
    ): User
    addProduct(
      createdAt: Date!
      updatedAt: Date!
      name: String!
      description: String!
      coverImage: String!
      images: [String!]!
      sellerPrice: Float!
      buyerPrice: Float!
      unit: Unit!
    ): Product
    addBasket(
      createdAt: Date!
      updatedAt: Date!
      name: String!
      description: String!
      coverImage: String!
      images: [String!]!
      buyerPrice: Float!
      products: [BasketProductInput]!
    ): Basket
    addProductOffer(
      createdAt: Date!
      updatedAt: Date!
      ownerId: ID!
      productId: ID!
      quantity: Int!
      status: ProductOfferStatus!
    ): ProductOffer
    addOrder(
      createdAt: Date!
      updatedAt: Date!
      ownerId: ID!
      productId: ID!
      pickupLocation: String!
      quantity: Int!
      status: OrderStatus!
    ): Order
    addReview(
      createdAt: Date!
      updatedAt: Date!
      ownerId: ID!
      orderIds: [ID!]!
      rating: Int!
      description: String
    ): Review
  }
`;
