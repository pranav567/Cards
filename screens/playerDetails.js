import { useState } from "react";
import { ImageBackground, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import {
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import User from "../user";

const PlayerDetails = ({ navigation }) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const startGame = () => {
    if (
      player1 !== "" &&
      player2 !== "" &&
      player1.toLowerCase() !== player2.toLowerCase()
    ) {
      // setPlayer1("");
      // setPlayer2("");
      const obj1 = new User(player1, 500000, 1);
      const obj2 = new User(player2, 500000, 2);
      navigation.navigate("Game", { user1: obj1, user2: obj2 });
    } else {
      Toast.show({
        type: "error",
        text1: "Incomplete Fields",
        text2: "Fill all Fields and don't fill same names",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    innerContainer: {
      marginTop: 10,
      paddingTop: 30,
      flexDirection: "column",
      borderTopColor: "white",
      borderTopWidth: 1,
    },
    imageBackground: {
      height: "100%",
      resizeMode: "cover",

      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    header: {
      width: "100%",
      alignItems: "center",
      padding: 10,
    },
    textHeader: { fontSize: 30, color: "white" },
    players: {
      // flexDirection
      width: "100%",
      alignItems: "center",
      marginTop: 120,
    },
    start: {
      width: "100%",
      alignItems: "center",
      marginTop: 120,
    },
    startButton: {
      borderWidth: 1,
      borderColor: "white",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <ImageBackground
          source={require("../assets/backside-blur.jpg")}
          style={styles.imageBackground}
        >
          <View style={styles.header}>
            <Text style={styles.textHeader}>Players Details</Text>
          </View>
          <View style={styles.players}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 20, marginRight: 10, color: "white" }}>
                Player 1 :{" "}
              </Text>
              <TextInput
                style={{
                  fontSize: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  color: "white",
                }}
                value={player1}
                maxLength={10}
                onChangeText={setPlayer1}
                placeholder="Enter your name here"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              <Text style={{ fontSize: 20, color: "white", marginRight: 10 }}>
                Player 2 :{" "}
              </Text>
              <TextInput
                style={{
                  fontSize: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  color: "white",
                }}
                value={player2}
                maxLength={10}
                onChangeText={setPlayer2}
                placeholder="Enter your name here"
              />
            </View>
          </View>
          <View style={styles.start}>
            <TouchableOpacity
              onPress={() => {
                startGame();
              }}
              style={styles.startButton}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PlayerDetails;
