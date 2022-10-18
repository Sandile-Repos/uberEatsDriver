import { View, Text, FlatList } from "react-native";
import React, { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import orders from "../../../assets/data/orders.json";
import OrderItem from "../../components/OrderItem";

const OrderScreen = () => {
  const bottomSheetRef = useRef();
  return (
    <GestureHandlerRootView style={{ backgroundColor: "lightblue", flex: 1 }}>
      {/* index={1} in BottomSheet will take the second value(95%) from snapPoints therefor
      bottomsheet will be opened when component mounts but will take the first value(25%) if not
      defined */}
      <BottomSheet ref={bottomSheetRef} snapPoints={["12%", "95%"]}>
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
