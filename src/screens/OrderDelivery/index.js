import { View, Text, FlatList } from "react-native";
import React, { useRef, useMemo } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";

import orders from "../../../assets/data/orders.json";
import OrderItem from "../../components/OrderItem";
import { styles } from "./styles";
const order = orders[0];

const OrderDelivery = () => {
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* index={1} in BottomSheet will take the second value(95%) from snapPoints therefor
      bottomsheet will be opened when component mounts but will take the first value(25%) if not
      defined */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>14 min</Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="#3FC060"
            style={styles.shoppingBag}
          />
          <Text style={styles.routeDetailsText}>5 km</Text>
        </View>
        <View style={styles.deliveryDetailsContainer}>
          <View>
            <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
            <View style={styles.addressContainer}>
              <Fontisto name="shopping-store" size={22} color="grey" />
              <Text style={styles.addressText}>{order.Restaurant.address}</Text>
            </View>

            <View style={styles.addressContainer}>
              <Fontisto name="map-marker-alt" size={22} color="grey" />
              <Text style={styles.addressText}>{order.User.address}</Text>
            </View>
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderItemText}>Onion rings x1</Text>
            <Text style={styles.orderItemText}>Big Mac x3</Text>
            <Text style={styles.orderItemText}>Big Tasty x2</Text>
            <Text style={styles.orderItemText}>Coca-Cola 500ml * 1</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Accept Order</Text>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default OrderDelivery;
