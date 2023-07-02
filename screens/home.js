import { TouchableOpacity } from "react-native";
import {
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
} from "react-native";

const Home = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      height: "100%",
      resizeMode: "cover",

      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: "35%",
      borderWidth: 1,
      borderColor: "white",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
    },
    text: { fontSize: 20, color: "white" },
  });
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/splash-2-blur.jpg")}
        style={styles.imageBackground}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Details");
            //
          }}
          style={styles.button}
        >
          <Text style={styles.text}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Rules");
          }}
          style={[styles.button, { marginTop: 20 }]}
        >
          <Text style={styles.text}>Rules</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default Home;
