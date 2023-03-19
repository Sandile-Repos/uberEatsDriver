// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED"
};

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const { Restaurant, Dish, User, BasketDish, Basket, OrderDish, Order, Courier } = initSchema(schema);

export {
  Restaurant,
  Dish,
  User,
  BasketDish,
  Basket,
  OrderDish,
  Order,
  Courier,
  OrderStatus,
  TransportationModes
};