import { View, Text, useWindowDimensions } from "react-native";
import React, { useMemo, useRef, useState, useEffect } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";

import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import { Order } from "../../models";

import OrderItem from "../../components/OrderItem";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);

  const bottomSheetRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  useEffect(() => {
    DataStore.query(Order, (order) =>
      order.status("eq", "READY_FOR_PICKUP")
    ).then(setOrders);
  }, []);
  console.log(orders);

  return (
    <View style={{ backgroundColor: "lightblue" }}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            coordinate={{
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            }}
            title={order.Restaurant.name}
            description={order.Restaurant.address}
          >
            <View
              style={{ backgroundColor: "green", padding: 5, borderRadius: 15 }}
            >
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              letterSpacing: 0.5,
              PaddingBottom: 5,
            }}
          >
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Available Orders: {orders.length}
          </Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default OrderScreen;
