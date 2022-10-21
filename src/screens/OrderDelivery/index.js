import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useRef, useMemo, useState, useEffect } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
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
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "./styles";
import { useOrderContext } from "../../contexts/OrderContext";

const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const OrderDelivery = () => {
  const {
    order,
    user,
    dishes,
    acceptOrder,
    fetchOrder,
    pickedUpOrder,
    completeOrder,
  } = useOrderContext();

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKM, setTotalKm] = useState(0);
  // const [deliveryStatus, setDeliveryStatus] = useState(
  //   ORDER_STATUSES.READY_FOR_PICKUP
  // );

  const [isDriverClose, setIsDriverClose] = useState(false);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

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

  const onButtonPressed = async () => {
    // if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
    if (order?.status === "READY_FOR_PICKUP") {
      bottomSheetRef.current.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
      acceptOrder();
    }
    // if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
    if (order?.status === "ACCEPTED") {
      bottomSheetRef.current?.collapse();
      pickedUpOrder();
    }
    // if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
    if (order?.status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
    }
  };

  const renderButtonTitle = () => {
    if (order?.status === "READY_FOR_PICKUP") {
      return "Accept Order";
    }
    if (order?.status === "ACCEPTED") {
      return "Pick-Up Order";
    }
    if (order?.status === "PICKED_UP") {
      return "Complete Delivery";
    }
  };

  const isButtonDisabled = () => {
    if (order?.status === "READY_FOR_PICKUP") {
      return false;
    }
    if (order?.status === "ACCEPTED" && isDriverClose) {
      return false;
    }
    if (order?.status === "PICKED_UP" && isDriverClose) {
      return false;
    }
    return true;
  };

  const restaurantLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };
  const deliveryLocation = {
    latitude: user?.lat,
    longitude: user?.lng,
  };

  if (!order || !user || !driverLocation) {
    return (
      <ActivityIndicator size={"large"} color="grey" style={{ flex: 1 }} />
    );
  }
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
            order?.status === "ACCEPTED" ? restaurantLocation : deliveryLocation
          }
          strokeWidth={10}
          waypoints={
            order?.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []
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
            style={{
              backgroundColor: "green",
              padding: 5,
              borderRadius: 15,
            }}
          >
            <Entypo name="shop" size={30} color="white" />
          </View>
        </Marker>
        <Marker
          coordinate={deliveryLocation}
          title={user?.name}
          description={user?.address}
        >
          <View
            style={{
              backgroundColor: "green",
              padding: 5,
              borderRadius: 15,
            }}
          >
            <MaterialIcons name="restaurant" size={30} color="white" />
          </View>
        </Marker>
      </MapView>

      {order?.status === "READY_FOR_PICKUP" && (
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
              <Text style={styles.addressText}>{user?.address}</Text>
            </View>
          </View>
          <View style={styles.orderDetails}>
            {dishes?.map((dishItem) => (
              <Text style={styles.orderItemText} key={dishItem.id}>
                {dishItem.Dish.name} x{dishItem.quantity}
              </Text>
            ))}
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
