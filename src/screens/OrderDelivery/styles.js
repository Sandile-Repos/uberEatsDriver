import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: { backgroundColor: "lightblue", flex: 1 },
  handleIndicator: { backgroundColor: "grey", width: "25%" },
  handleIndicatorContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  routeDetailsText: { fontSize: 25, letterSpacing: 1 },
  shoppingBag: { marginHorizontal: 10 },
  deliveryDetailsContainer: { paddingHorizontal: 20 },
  restaurantName: { fontSize: 25, letterSpacing: 1, paddingVertical: 20 },
  addressContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addressText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginLeft: 15,
  },
  orderDetails: { borderTopWidth: 1, borderColor: "lightgrey" },
  orderItemText: {
    fontSize: 18,
    color: "grey",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  buttonContainer: {
    backgroundColor: "#3FC060",
    marginTop: "auto",
    marginHorizontal: 10,
    marginVertical: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});