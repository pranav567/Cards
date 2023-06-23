import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();
import LandingScreen from "./screens/landingScreen";
import Home from "./screens/home";
import PlayerDetails from "./screens/playerDetails";
import Game from "./screens/game";
import Rules from "./screens/rules";

export default function App() {
  return (
    <>
      <Toast position="top" topOffset={20} />

      <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator>
          {/* <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Rules"
            component={Rules}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={PlayerDetails}
            options={{
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Game"
            component={Game}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast position="bottom" bottomOffset={20} />
    </>
  );
}
