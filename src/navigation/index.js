import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import OrderDelivery from "../screens/OrderDelivery";

const Stack = createNativeStackNavigator();
const Navigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdersScreen" component={OrderScreen} />
    <Stack.Screen name="OrdersDeliveryScreen" component={OrderDelivery} />
  </Stack.Navigator>
);
export default Navigation;
