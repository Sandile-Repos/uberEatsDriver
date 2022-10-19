import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useRef, useMemo, useState, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FontAwesome5,
  Fontisto,
  Entypo,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";

import { styles } from "./styles";
import orders from "../../../assets/data/orders.json";
import { useNavigation } from "@react-navigation/native";

const order = orders[0];

const restaurantLocation = {
  latitude: order.Restaurant.lat,
  longitude: order.Restaurant.lng,
};
const deliveryLocation = {
  latitude: order.User.lat,
  longitude: order.User.lng,
};

const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKM, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(
    ORDER_STATUSES.READY_FOR_PICKUP
  );

  const [isDriverClose, setIsDriverClose] = useState(false);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const navigation = useNavigation();

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

    const foregroundSubscription = async () => {
      await Location.watchPositionAsync(
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
    };
    return foregroundSubscription;
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }

  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      console.warn("Delivery Finished");
    }
  };

  const renderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return "Accept Order";
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return "Pick-Up Order";
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      return "Complete Delivery";
    }
  };

  const isButtonDisabled = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
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
          destination={
            deliveryStatus === ORDER_STATUSES.ACCEPTED
              ? restaurantLocation
              : deliveryLocation
          }
          strokeWidth={10}
          waypoints={
            deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP
              ? [restaurantLocation]
              : []
          }
          strokeColor="#3FC060"
          onReady={(result) => {
            setIsDriverClose(result.distance <= 0.1);
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
      {deliveryStatus == ORDER_STATUSES.READY_FOR_PICKUP && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="grey"
          style={{ position: "absolute", top: 40, left: 15 }}
        />
      )}
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
        <Pressable
          style={styles.buttonContainer}
          onPress={onButtonPressed}
          disabled={isButtonDisabled()}
        >
          <Text
            style={{
              ...styles.buttonText,
              backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
            }}
          >
            {renderButtonTitle()}
          </Text>
        </Pressable>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default OrderDelivery;
