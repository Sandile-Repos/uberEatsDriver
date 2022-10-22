import { createContext, useEffect, useState, useContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier, Order, User, OrderDish } from "../../models";
import { useAuthContext } from "../AuthContext";
import { set } from "react-native-reanimated";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    try {
      const fetchedOrder = await DataStore.query(Order, id);
      setOrder(fetchedOrder);

      const fetchUser = await DataStore.query(User, fetchedOrder.userID);
      setUser(fetchUser);

      const fetchDish = await DataStore.query(OrderDish, (od) =>
        od.orderID("eq", fetchedOrder.id)
      );
      setDishes(fetchDish);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!order) {
      return;
    }

    //subscribing to order update
    //status was not updating to Accepted when the order was updated
    const subscription = DataStore.observe(Order, order.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          //order updated behind the scen, fetch new ordersd
          fetchOrder(element.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [order?.id]);

  const acceptOrder = async () => {
    // update the order, and change status, and assign the courier
    try {
      const updatedOrder = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "ACCEPTED";
          updated.Courier = dbCourier;
        })
      );
      setOrder(updatedOrder);
    } catch (error) {
      console.log(error);
    }
  };

  const pickUpOrder = async () => {
    // update the order, and change status, and assign the courier
    try {
      const updatedOrder = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "PICKED_UP";
        })
      );
      setOrder(updatedOrder);
    } catch (error) {
      console.log(error);
    }
  };

  const completeOrder = async () => {
    // update the order, and change status, and assign the courier
    try {
      const orders = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "COMPLETED";
        })
      );
      setOrder(orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
