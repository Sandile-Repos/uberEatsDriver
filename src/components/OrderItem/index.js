import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../models";

const OrderItem = ({ order }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(User, order.userID).then(setUser);
  }, []);

  return (
    <Pressable
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("OrdersDeliveryScreen", { id: order.id })
      }
    >
      <Image source={{ uri: order?.Restaurant?.image }} style={styles.image} />
      <View style={styles.description}>
        <Text style={styles.name}>{order?.Restaurant?.name}</Text>
        <Text style={styles.detail}>{order?.Restaurant?.address}</Text>
        <Text style={styles.deliveryDetails}>Delivery Details</Text>
        <Text style={styles.detail}>{user?.name}</Text>
        <Text style={styles.detail}>{user?.address}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Entypo name="check" size={30} color="black" style={styles.icon} />
      </View>
    </Pressable>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    margin: 10,
    borderColor: "#3FC060",
    borderWidth: 2,
    borderRadius: 12,
  },
  image: {
    width: "25%",
    height: "100%",

    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  description: {
    marginLeft: 10,
    flex: 1,
    paddingVertical: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  detail: { color: "grey" },
  deliveryDetails: { marginTop: 10 },
  iconContainer: {
    padding: 5,
    backgroundColor: "#3FC060",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: { marginLeft: "auto" },
});
