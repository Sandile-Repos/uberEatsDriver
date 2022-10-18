import { View, Text, FlatList, useWindowDimensions } from "react-native";
import React, { useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";

import orders from "../../../assets/data/orders.json";
import OrderItem from "../../components/OrderItem";

const OrderScreen = () => {
  const bottomSheetRef = useRef();
  const { height, width } = useWindowDimensions();
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  return (
    <GestureHandlerRootView style={{ backgroundColor: "lightblue", flex: 1 }}>
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
        <View style={{ alignItems: "center", flex: 1 }}>
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
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default OrderScreen;
