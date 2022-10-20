import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import OrderDelivery from "../screens/OrderDelivery";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuthContext } from "../contexts/AuthContext";
const Stack = createNativeStackNavigator();
const Navigation = () => {
  const { dbCourier } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen name="OrdersScreen" component={OrderScreen} />
          <Stack.Screen name="OrdersDeliveryScreen" component={OrderDelivery} />
        </>
      ) : (
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      )}
    </Stack.Navigator>
  );
};
export default Navigation;
