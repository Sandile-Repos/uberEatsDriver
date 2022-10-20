import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation";
import { withAuthenticator } from "aws-amplify-react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import AuthContextProvider from "./src/contexts/AuthContext";

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default withAuthenticator(App);
