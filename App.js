import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import OrderDelivery from "./src/screens/OrderDelivery";

export default function App() {
  return (
    <View style={styles.container}>
      <OrderDelivery />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingTop: 40,
  },
});
