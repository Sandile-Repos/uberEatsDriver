import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useRef, useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { DataStore } from "aws-amplify";
import { Order } from "../../models";
import OrderItem from "../../components/OrderItem";
import CustomMarker from "../../components/CustomMarker";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);

  const bottomSheetRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const fetchOrders = () => {
    DataStore.query(Order, (order) => order.status("eq", "READY_FOR_PICKUP"))
      .then(setOrders)
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchOrders();

    const subscription = DataStore.observe(Order).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        fetchOrders();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Permission Denied");
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync();
        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  if (!driverLocation) {
    return (
      <ActivityIndicator size={"large"} color="grey" style={{ flex: 1 }} />
    );
  }
  return (
    <View style={{ backgroundColor: "lightblue" }}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        {orders.map((order) => (
          <CustomMarker
            key={order.id}
            data={order.Restaurant}
            type={"RESTAURANT"}
          />
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
