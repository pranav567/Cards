// import { useState } from "react";
// import { ImageBackground, TextInput } from "react-native";
// import { TouchableOpacity } from "react-native";
// import Toast from "react-native-toast-message";
// import { Picker } from "@react-native-picker/picker";
// import { Text, StyleSheet, ScrollView, View } from "react-native";
// import User from "../user";

// const plyrList = [2, 3, 4, 5, 6, 7, 8];

// const PlayerDetails = ({ navigation }) => {
//   console.log("hello");
//   const [totalPlayers, setTotalPlayers] = useState(2);
//   const [players, setPlayers] = useState(["", ""]);

//   const checkDuplicateNames = () => {
//     let tmpPlyrs = [];
//     let emptyCheck = false;
//     for (let i in players) {
//       if (i == "") emptyCheck = true;
//       tmpPlyrs.push(i.toLowerCase());
//     }
//     const uniqueSet = new Set(tmpPlyrs);
//     return !emptyCheck && uniqueSet.size === tmpPlyrs.length;
//   };

//   const startGame = () => {
//     if (checkDuplicateNames()) {
//       // setPlayer1("");
//       // setPlayer2("");
//       navigation.navigate("Game", { user1: obj1, user2: obj2 });
//     } else {
//       Toast.show({
//         type: "error",
//         text1: "Incomplete Fields",
//         text2: "Fill all Fields and don't fill same names",
//         position: "bottom",
//         visibilityTime: 1000,
//         autoHide: true,
//       });
//     }
//   };

//   const playerNameHandle = (ind, val) => {
//     let tmp = players;
//     tmp[ind] = val;
//     setPlayers(tmp);
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "black",
//     },
//     innerContainer: {
//       // marginTop: 10,
//       paddingTop: 30,
//       flexDirection: "column",
//       borderTopColor: "white",
//       borderTopWidth: 1,
//     },
//     imageBackground: {
//       height: "100%",
//       resizeMode: "cover",
//       width: "100%",
//       flexDirection: "column",
//       justifyContent: "flex-start",
//       alignItems: "center",
//     },
//     header: {
//       width: "100%",
//       alignItems: "center",
//       padding: 10,
//     },
//     textHeader: { fontSize: 30, color: "white" },
//     players: {
//       // flexDirection
//       width: "100%",
//       alignItems: "center",
//       marginTop: 120,
//     },
//     start: {
//       width: "100%",
//       alignItems: "center",
//       marginTop: 120,
//     },
//     startButton: {
//       borderWidth: 1,
//       borderColor: "white",
//       alignItems: "center",
//       padding: 10,
//       borderRadius: 20,
//     },
//   });
//   return (
//     <View style={styles.container}>
//       <View style={styles.innerContainer}>
//         <ImageBackground
//           source={require("../assets/backside-blur.jpg")}
//           style={styles.imageBackground}
//         >
//           <View style={styles.header}>
//             <Text style={styles.textHeader}>Players Details</Text>
//           </View>
//           <View>
//             <Picker
//               selectedValue={totalPlayers}
//               onValueChange={(itemValue) => {
//                 setTotalPlayers(itemValue);
//                 let newPlayer = [];
//                 for (let i = 0; i < itemValue; i++) newPlayer.push("");
//                 setPlayers(newPlayer);
//               }}
//             >
//               {plyrList.map((obj, ind) => (
//                 <Picker.Item key={ind} label={obj} value={obj} />
//               ))}
//             </Picker>
//           </View>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             style={{ height: 200 }}
//           >
//             <View style={styles.players}>
//               {players.map((obj, ind) => (
//                 <View
//                   key={ind}
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     marginTop: ind == 0 ? 0 : 40,
//                   }}
//                 >
//                   <Text
//                     style={{ fontSize: 20, marginRight: 10, color: "white" }}
//                   >
//                     Player {ind + 1} :{" "}
//                   </Text>
//                   <TextInput
//                     style={{
//                       fontSize: 18,
//                       borderBottomWidth: 1,
//                       borderBottomColor: "black",
//                       color: "white",
//                     }}
//                     value={obj}
//                     maxLength={10}
//                     onChangeText={(e) => {
//                       playerNameHandle(ind, e);
//                     }}
//                     placeholder="Enter your name here"
//                   />
//                 </View>
//               ))}
//             </View>
//             <View style={styles.start}>
//               <TouchableOpacity
//                 onPress={() => {
//                   startGame();
//                 }}
//                 style={styles.startButton}
//               >
//                 <Text style={{ color: "white", fontSize: 20 }}>Start Game</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default PlayerDetails;

import { useState } from "react";
import { ImageBackground, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import User from "../user";
import { Ionicons } from "@expo/vector-icons";

const plyrList = [2, 3, 4, 5, 6, 7, 8];

const PlayerDetails = ({ navigation }) => {
  const [totalPlayers, setTotalPlayers] = useState(2);
  const [players, setPlayers] = useState(["", ""]);
  const [currName, setCurrName] = useState("");
  const [curr, setCurr] = useState(-1);

  const checkDuplicateNames = () => {
    let tmpPlyrs = [];
    let emptyCheck = false;
    for (let i in players) {
      if (players[i] == "") emptyCheck = true;
      tmpPlyrs.push(players[i].toLowerCase());
    }
    const uniqueSet = new Set(tmpPlyrs);
    return !emptyCheck && uniqueSet.size === tmpPlyrs.length;
  };

  const startGame = () => {
    if (checkDuplicateNames()) {
      // setPlayer1("");
      // setPlayer2("");
      let objArr = [];
      players.forEach((obj, ind) => {
        objArr.push(new User(obj, 500000, ind + 1));
      });
      navigation.navigate("Game", { users: objArr });
      Toast.show({
        type: "success",
        text1: "Players Created",
        position: "bottom",
        visibilityTime: 1000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Incomplete Fields",
        text2: "Fill all Fields and don't fill same names",
        position: "bottom",
        visibilityTime: 1000,
        autoHide: true,
      });
    }
  };

  const playerNameHandle = (ind, val) => {
    let tmp = players;
    tmp[ind] = val;
    setPlayers(tmp);
    // console.log(tmp);
    setCurr(ind);
    setCurrName(val);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    innerContainer: {
      // marginTop: 10,
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
    },
    start: {
      width: "100%",
      alignItems: "center",
      marginTop: 40,
      marginBottom: 50,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 20,
                padding: 5,
                width: "30%",
                alignItems: "center",
              }}
              onPress={() => {
                let num = totalPlayers + 1;
                if (num > 0 && num < 9) {
                  setTotalPlayers(num);
                  let newPlayer = players;
                  newPlayer.push("");
                  setPlayers(newPlayer);
                  setCurr(-1);
                  setCurrName("");
                }
              }}
            >
              <Text style={{ fontSize: 18, color: "white" }}>Add Player</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.players}>
              {players.map((obj, ind) => (
                <View
                  key={ind}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: ind == 0 ? 0 : 40,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, marginRight: 10, color: "white" }}
                  >
                    Player {ind + 1} :{" "}
                  </Text>
                  <TextInput
                    style={{
                      fontSize: 18,
                      borderBottomWidth: 1,
                      borderBottomColor: "white",
                      color: "white",
                      marginRight: 15,
                    }}
                    value={curr == ind ? currName : obj}
                    maxLength={10}
                    onChangeText={(e) => {
                      playerNameHandle(ind, e);
                    }}
                    placeholder="                                    "
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let tmp = players.filter((ob, index) => {
                        return index !== ind;
                      });
                      setCurr(-1);
                      setCurrName("");
                      setPlayers(tmp);
                      setTotalPlayers(totalPlayers - 1);
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      color="white"
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {players.length > 0 && (
              <View style={styles.start}>
                <TouchableOpacity
                  onPress={() => {
                    startGame();
                  }}
                  style={styles.startButton}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Start Game
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PlayerDetails;
