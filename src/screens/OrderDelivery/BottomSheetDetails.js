import { View, Text, Pressable } from "react-native";
import React, { useRef, useMemo } from "react";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useOrderContext } from "../../contexts/OrderContext";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: "Accept Order",
  ACCEPTED: "Pick-Up Order",
  PICKED_UP: "Complete Delivery",
};

const BottomSheetDetails = (props) => {
  const { totalKm, totalMinutes, onAccepted } = props;
  const isDriverClose = totalKm <= 1; //decrease for higher accuracy
  const { order, user, dishes, acceptOrder, pickUpOrder, completeOrder } =
    useOrderContext();

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  const navigation = useNavigation();

  const onButtonPressed = async () => {
    const { status } = order;
    if (status === "READY_FOR_PICKUP") {
      bottomSheetRef.current.collapse();
      await acceptOrder();
      onAccepted();
    } else if (status === "ACCEPTED") {
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
    } else if (status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
    }
  };

  const isButtonDisabled = () => {
    const { status } = order;
    if (status === "READY_FOR_PICKUP") {
      return false;
    }
    if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
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
        <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
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
          {STATUS_TO_TITLE[order.status]}
        </Text>
      </Pressable>
    </BottomSheet>
  );
};

export default BottomSheetDetails;
