import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
} from "react-native";

const blackjackRules = [
  "The goal of Blackjack is to get a hand value as close to 21 as possible without exceeding it.",
  "Each player is dealt two cards initially, and the dealer also receives two cards with one card face up and the other face down.",
  "Numbered cards are worth their face value, face cards (King, Queen, Jack) are worth 10, and an Ace can be worth 1 or 11.",
  "Players have the option to 'hit' to receive another card or 'stand' to keep their current hand.",
  "Another option is `Raise` which doubles the user's bet and is given one more card but is allowed no more cards post that!",
  "If a player's hand value exceeds 21, they go 'bust' and lose the round.",
  "After all players have completed their turns, the dealer reveals their face-down card.",
  "The dealer must hit on a hand value of 16 or less and stand on a hand value of 17 or more.",
  "If the dealer busts, all players who are still in the game win.",
  "If the dealer does not bust, the dealer's hand is compared to each player's hand, and the highest hand wins.",
  "If a player's hand value equals the dealer's hand value, it results in a tie or 'push' (no one wins or loses).",
  "Remember to enjoy the game and have fun!",
];

const Rules = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      height: "100%",
      resizeMode: "cover",

      width: "100%",
      alignItems: "center",
    },
    button: {
      borderWidth: 1,
      borderColor: "white",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
    },
    text: {
      fontSize: 15,
      color: "white",
      textAlign: "justify",
      width: "90%",
    },
  });
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/splash-2-blur.jpg")}
        style={styles.imageBackground}
      >
        <View
          style={{
            flexDirection: "column",
            width: "90%",
            backgroundColor: "Red",
          }}
        >
          <Text
            style={{
              margin: 40,
              color: "white",
              fontSize: 35,
              textAlign: "center",
            }}
          >
            Rules
          </Text>
          <View style={{ height: "63.0%" }}>
            <ScrollView>
              {blackjackRules.map((obj, ind) => (
                <View
                  key={ind}
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    marginTop: ind == 0 ? 0 : 15,
                  }}
                >
                  <Ionicons
                    name="md-arrow-forward-circle"
                    color="white"
                    style={{ marginTop: 5, marginRight: 20 }}
                  />
                  <Text style={styles.text}>{obj}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Details");
              }}
              style={styles.button}
            >
              <Text style={{ color: "white", fontSize: 20 }}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Rules;
