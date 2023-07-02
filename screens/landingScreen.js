import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
      // onPress={() => {
      //   navigation.navigate("Home");
      // }}
      >
        <Image
          source={require("../assets/adaptive-icon.jpeg")}
          style={styles.image}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width: 200,
    height: 320,
  },
});

export default LandingScreen;

// import React from 'react'

// export const landingScreen = () => {
//   return (
//     <div>landingScreen</div>
//   )
// }
