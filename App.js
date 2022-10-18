import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import OrderScreen from "./src/screens/OrderScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <OrderScreen />

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
