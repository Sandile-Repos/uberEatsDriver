import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useMemo, useState, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FontAwesome5,
  Fontisto,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";

import { styles } from "./styles";
import orders from "../../../assets/data/orders.json";
import OrderItem from "../../components/OrderItem";

const order = orders[0];

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKM, setTotalKm] = useState(0);

  const bottomSheetRef = useRef(null);
  const { height, width } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Permission Denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        //Tracking options
        accuracy: Location.Accuracy.High, // how accurate location tracking should be
        distanceInterval: 100, // how often we should track the position or rerun function eg 100 meters. this will update distance and duration after every 100 meters
      },
      (updatedLocation) => {
        //Update driver location
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }
  return (
    <GestureHandlerRootView style={styles.container}>
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
        <MapViewDirections
          origin={driverLocation}
          destination={{
            latitude: order.User.lat,
            longitude: order.User.lng,
          }}
          strokeWidth={10}
          waypoints={[
            {
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            },
          ]}
          strokeColor="#3FC060"
          onReady={(result) => {
            setTotalKm(result.distance);
            setTotalMinutes(result.duration);
          }}
          apikey={GOOGLE_API_KEY}
        />
        <Marker
          coordinate={{
            latitude: order.Restaurant.lat,
            longitude: order.Restaurant.lng,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
          }}
          title={order.Restaurant.name}
          description={order.Restaurant.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 15 }}
          >
            <Entypo name="shop" size={30} color="white" />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: order.User.lat,
            longitude: order.User.lng,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
          }}
          title={order.User.name}
          description={order.User.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 15 }}
          >
            <MaterialIcons name="restaurant" size={30} color="white" />
          </View>
        </Marker>
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>
            {totalMinutes.toFixed(0)} min
          </Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="#3FC060"
            style={styles.shoppingBag}
          />
          <Text style={styles.routeDetailsText}>{totalKM.toFixed(2)} km</Text>
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
