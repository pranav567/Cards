import { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import {
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
  Dimensions,
} from "react-native";

import { cardObj, cardScore } from "../assets/taash/cards";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const cardNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
];

const Game = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;

  // Calculate the left value
  const leftValue = windowWidth / 2 - 35;
  const leftValue1 = windowWidth / 2 - 120;
  const rightValue1 = windowWidth / 2 - 120;

  const [availableCards, setAvailableCards] = useState(cardNumbers);
  const [currentPlayer, setCurrentPlayer] = useState(route.params.user1);
  const [potAmount, setPotAmount] = useState(0);
  const [dealerCards, setDealerCards] = useState([]);
  const [showDealer, setShowDealer] = useState(false);
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [dealerCardCount, setDealerCardCount] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [raise, setRaise] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  //[{name,cards,score,winnings}]
  const [showWinner, setShowWinner] = useState([]);
  const [deal, setDeal] = useState(1000);

  const [userCardCount, setUserCardCount] = useState(-1);

  const handleRotationPress = async (rotate) => {
    if (!rotate) {
      // console.log(typeof lockAsync);
      await lockAsync(OrientationLock.PORTRAIT_UP);
    } else {
      await lockAsync(OrientationLock.PORTRAIT_DOWN); // Lock the screen orientation to upside down
    }
  };

  useEffect(() => {
    const gameDisplay = () => {
      if (gameOver) {
        //decide winner
        let a = dealerScore;
        let b = user1Data.getScore();
        let c = user2Data.getScore();

        let tmp1 = user1Data;
        let tmp2 = user2Data;

        let arr = [];
        let scores = [a, b, c];
        let mx = 0;
        let finalArrayName = [];
        scores.forEach((obj, index) => {
          if (obj < 22 && obj > mx) mx = obj;
        });

        // console.log(mx);

        if (a == mx) {
          finalArrayName.push("dealer");
        }
        if (b == mx) {
          finalArrayName.push("user1");
        }
        if (c == mx) {
          finalArrayName.push("user2");
        }
        // console.log(finalArrayName);

        if (mx == 21 && finalArrayName.length > 1) {
          let winners = 0;
          if (a == 21 && dealerCardCount == 2) winners += 1;
          if (b == 21 && user1Data.getCards().length == 2) winners += 1;
          if (c == 21 && user2Data.getCards().length == 2) winners += 1;

          if (a == 21 && dealerCardCount == 2) {
            arr.push({
              name: "Dealer",
              winning: Math.floor(potAmount / winners),
              score: dealerScore,
              cards: dealerCards,
            });
          }
          if (b == 21 && user1Data.getCards().length == 2) {
            arr.push({
              balance:
                user1Data.getCoinBalance() + Math.floor(potAmount / winners),
              name: user1Data.getName(),
              winning: Math.floor(potAmount / winners),
              score: user1Data.getScore(),
              cards: user1Data.getCards(),
            });
            tmp1.addCoins(Math.floor(potAmount / winners));
          }
          if (c == 21 && user2Data.getCards().length == 2) {
            arr.push({
              balance:
                user2Data.getCoinBalance() + Math.floor(potAmount / winners),
              name: user2Data.getName(),
              winning: Math.floor(potAmount / winners),
              score: user2Data.getScore(),
              cards: user2Data.getCards(),
            });
            tmp2.addCoins(Math.floor(potAmount / winners));
          }
        } else {
          if (finalArrayName.length > 0) {
            if (finalArrayName.includes("dealer")) {
              // console.log("hell");
              arr.push({
                name: "Dealer",
                winning: Math.floor(potAmount / finalArrayName.length),
                score: dealerScore,
                cards: dealerCards,
              });
            }
            if (finalArrayName.includes("user1")) {
              // console.log("hell");
              arr.push({
                balance:
                  user1Data.getCoinBalance() +
                  Math.floor(potAmount / finalArrayName.length),
                name: user1Data.getName(),
                winning: Math.floor(potAmount / finalArrayName.length),
                score: user1Data.getScore(),
                cards: user1Data.getCards(),
              });
              tmp1.addCoins(Math.floor(potAmount / finalArrayName.length));
            }
            if (finalArrayName.includes("user2")) {
              // console.log("hell");
              arr.push({
                balance:
                  user2Data.getCoinBalance() +
                  Math.floor(potAmount / finalArrayName.length),
                name: user2Data.getName(),
                winning: Math.floor(potAmount / finalArrayName.length),
                score: user2Data.getScore(),
                cards: user2Data.getCards(),
              });
              tmp2.addCoins(Math.floor(potAmount / finalArrayName.length));
            }
          } else {
            arr.push({
              balance: user1Data.getCoinBalance() + Math.floor(potAmount / 2),
              name: user1Data.getName(),
              winning: Math.floor(potAmount / 2),
              score: user1Data.getScore(),
              cards: user1Data.getCards(),
            });
            tmp1.addCoins(Math.floor(potAmount / 2));
            arr.push({
              balance: user2Data.getCoinBalance() + Math.floor(potAmount / 2),
              name: user2Data.getName(),
              winning: Math.floor(potAmount / 2),
              score: user2Data.getScore(),
              cards: user2Data.getCards(),
            });
            tmp2.addCoins(Math.floor(potAmount / 2));
          }
        }

        // console.log(arr);
        tmp1.reset();
        tmp2.reset();
        setUser1Data(tmp1);
        setUser2Data(tmp2);
        setShowWinner(arr);
      }
    };
    gameDisplay();
  }, [gameOver]);

  useEffect(() => {
    const hitDealer = () => {
      let cardsDealer = dealerCards;
      let score = 0;
      cardsDealer.forEach((obj) => {
        if (cardScore[obj][0] == 1) {
          score += 11;
        } else {
          score += cardScore[obj][0];
        }
      });
      if (score <= 16) {
        let arr = availableCards;

        let getIndex = Math.floor(Math.random() * arr.length);
        cardsDealer.push(arr[getIndex]);
        score = 0;
        cardsDealer.forEach((obj) => {
          if (cardScore[obj][0] == 1) {
            score += 11;
          } else {
            score += cardScore[obj][0];
          }
        });
        arr = arr.filter((obj) => {
          return obj !== arr[getIndex];
        });

        setAvailableCards(arr);
        setDealerCards(cardsDealer);
        setDealerScore(score);
      } else {
        setGameOver(true);
      }
      setDealerCardCount(cardsDealer.length);
    };

    // console.log(currentPlayer);
    if (currentPlayer == null) {
      // console.log("pranava");
      setTimeout(hitDealer, 1000);
      // hitDealer();
    }
  }, [dealerCardCount]);

  useEffect(() => {
    const getDealerCards = () => {
      if (dealerCards.length < 2) {
        let arr = availableCards;
        let selectedCards = dealerCards;
        let getIndex = Math.floor(Math.random() * arr.length);
        selectedCards.push(arr[getIndex]);
        arr = arr.filter((obj) => {
          return obj !== arr[getIndex];
        });
        setAvailableCards(arr);
        setDealerCards(selectedCards);
        setDealerCardCount(selectedCards.length);
      }
      // console.log(`delae count-${dealerCardCount}`);
      // console.log(selectedCards);
    };
    setTimeout(getDealerCards, 500);
  }, [dealerCardCount]);

  useEffect(() => {
    const dealCards = () => {
      let tmpUser = currentPlayer;
      if (userCardCount == 1) {
        setPotAmount(potAmount + deal);
        tmpUser.removeCoins(deal);
      }
      let arr = availableCards;
      let getIndex = Math.floor(Math.random() * arr.length);
      tmpUser.addCard(arr[getIndex]);
      tmpUser.computeScore();
      arr = arr.filter((obj) => {
        return obj !== arr[getIndex];
      });
      setAvailableCards(arr);
      setCurrentPlayer(tmpUser);
      setUserCardCount(tmpUser.getCards().length);
    };
    if (userCardCount < 2 && userCardCount >= 0) {
      setTimeout(dealCards, 500);
    }
  }, [userCardCount]);

  const stand = () => {
    let tmpUser = currentPlayer;
    tmpUser.computeScore();
    if (tmpUser.playerNumber == 1) {
      setUser1Data(tmpUser);
      setCurrentPlayer(route.params.user2);
      handleRotationPress(true);
    } else {
      handleRotationPress(false);
      setUser2Data(tmpUser);
      setCurrentPlayer(null);
      setShowDealer(true);
      let score = 0;
      dealerCards.forEach((obj) => {
        if (cardScore[obj][0] == 1) {
          score += 11;
        } else {
          score += cardScore[obj][0];
        }
      });
      // console.log(dealerCardCount);
      setDealerScore(score);
      setDealerCardCount(0);
    }
  };

  const hit = (raised = false) => {
    if (currentPlayer.getScore() < 21) {
      let tmpUser = currentPlayer;
      let arr = availableCards;

      let getIndex = Math.floor(Math.random() * arr.length);
      tmpUser.addCard(arr[getIndex]);
      tmpUser.computeScore();
      arr = arr.filter((obj) => {
        return obj !== arr[getIndex];
      });

      if (raised) {
        setPotAmount(potAmount + deal);
        tmpUser.removeCoins(deal);
      }

      setAvailableCards(arr);
      setCurrentPlayer(tmpUser);
    } else {
      Toast.show({
        type: "info",
        text1: "Maximum Score either reached or exceeded",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const nextRound = () => {
    setCurrentPlayer(user1Data);
    setPotAmount(0);
    setGameOver(false);
    setShowWinner([]);
    setDealerCardCount(0);
    setDealerScore(0);
    setDeal(deal + 1500);
    setShowDealer(false);
    setDealerCards([]);
    setAvailableCards(cardNumbers);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    imageBackground: {
      height: "100%",
      resizeMode: "cover",
      // borderWidth: 20,
      // borderColor: "#482121",
    },
    userBust: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 70,
      top: 540,
      left: leftValue,
    },
    userBust1: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 70,
      top: 600,
      left: leftValue1,
    },
    userBust2: {
      position: "absolute",
      width: 70,
      height: 70,
      borderRadius: 70,
      top: 600,
      right: rightValue1,
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/cardTable.jpg")}
        style={styles.imageBackground}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomRadius: 20,
            borderBottomColor: "white",
            backgroundColor: "black",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Details");
            }}
          >
            <Ionicons name="arrow-back" color={"white"} size={28} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, color: "white" }}>
            {currentPlayer !== null ? currentPlayer.getName() : "Results"}
          </Text>

          <Text style={{ fontSize: 24, color: "white" }}>
            {currentPlayer !== null
              ? `${currentPlayer.getCoinBalance()} chips`
              : ""}
          </Text>
        </View>
        {!gameOver ? (
          <>
            {currentPlayer !== null ? (
              <>
                <View
                  style={{
                    marginTop: 20,
                    padding: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {showDealer ? (
                    <>
                      {dealerCards.map((obj, index) => (
                        <Image
                          source={cardObj[obj]}
                          style={{
                            width: 100,
                            height: 140,
                            marginLeft: index !== 0 ? -60 : 0,
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                        //   <MyComponent obj={obj} />
                        //   <Text key={index}>{require(obj)}</Text>
                      ))}
                    </>
                  ) : (
                    <>
                      {dealerCards.map((obj, index) => (
                        <Image
                          source={
                            index != 0
                              ? require("../assets/taash/backside.jpg")
                              : cardObj[obj]
                          }
                          style={{
                            width: 100,
                            height: 140,
                            marginLeft: index !== 0 ? -60 : 0,
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                        //   <MyComponent obj={obj} />
                        //   <Text key={index}>{require(obj)}</Text>
                      ))}
                    </>
                  )}
                </View>
                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <Text style={{ color: "white" }}>
                    Dealer's Hand{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {currentPlayer == null ? `- ${dealerScore}` : ""}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    margin: 20,
                    //   marginBottom: 0,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      width: 100,
                      height: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 100,
                      borderColor: "white",
                    }}
                  >
                    <Text style={{ fontSize: 20, color: "white" }}>
                      {potAmount}
                    </Text>
                  </View>
                </View>
                <View style={{ marginBottom: 10, alignItems: "center" }}>
                  <Text style={{ color: "white" }}>
                    {currentPlayer.getName()}'s' Hand -{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {currentPlayer.getScore() > 0
                        ? currentPlayer.getScore()
                        : ""}
                    </Text>
                  </Text>
                </View>
                {currentPlayer.getCards().length == 0 ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // dealUserCards();
                        if (dealerCards.length == 2) setUserCardCount(0);
                      }}
                      style={{
                        width: "40%",
                        padding: 10,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "white",
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: "white" }}>Deal</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 0,
                      // backgroundColor: "red",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {currentPlayer.getScore() > 21 ? (
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            padding: 20,
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          {currentPlayer.getCards().map((obj, index) => (
                            <Image
                              source={cardObj[obj]}
                              style={{
                                width: 100,
                                height: 140,
                                marginLeft: index !== 0 ? -60 : 0,
                                borderRadius: 5,
                              }}
                              key={index}
                            />
                            //   <MyComponent obj={obj} />
                            //   <Text key={index}>{require(obj)}</Text>
                          ))}
                        </View>
                        <Image
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 70,
                            marginTop: -115,
                            marginBottom: 45,
                          }}
                          source={require("../assets/taash/bust.jpg")}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          padding: 20,
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        {currentPlayer.getCards().map((obj, index) => (
                          <Image
                            source={cardObj[obj]}
                            style={{
                              width: 100,
                              height: 140,
                              marginLeft: index !== 0 ? -60 : 0,
                              borderRadius: 5,
                            }}
                            key={index}
                          />
                          //   <MyComponent obj={obj} />
                          //   <Text key={index}>{require(obj)}</Text>
                        ))}
                      </View>
                    )}

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (raise) {
                            Toast.show({
                              type: "error",
                              text1: "Already Raised",
                              position: "Please Stand!!",
                              visibilityTime: 2000,
                              autoHide: true,
                            });
                          } else {
                            hit();
                          }
                        }}
                        disabled={currentPlayer.getCards().length < 2 || raise}
                        style={{
                          borderWidth: 1,
                          borderColor: "white",
                          borderRadius: 20,
                          width: "20%",
                          alignItems: "center",
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 15 }}>
                          Hit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          stand();
                          setRaise(false);
                        }}
                        style={{
                          borderWidth: 1,
                          borderColor: "white",
                          borderRadius: 20,
                          width: "20%",
                          alignItems: "center",
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 15 }}>
                          Stand
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (raise) {
                            Toast.show({
                              type: "error",
                              text1: "Already Raised",
                              position: "Please Stand!!",
                              visibilityTime: 2000,
                              autoHide: true,
                            });
                          } else {
                            hit(true);
                          }
                          setRaise(true);
                        }}
                        style={{
                          borderWidth: 1,
                          borderColor: "white",
                          borderRadius: 20,
                          width: "20%",
                          alignItems: "center",
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 15 }}>
                          Raise
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* {currentPlayer.getScore() > 21 ? (
                  <Image
                    style={styles.userBust}
                    source={require("../assets/taash/bust.jpg")}
                  />
                ) : (
                  <></>
                )} */}
              </>
            ) : (
              <>
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ color: "white" }}>
                    Dealer's Hand{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {currentPlayer == null ? `- ${dealerScore}` : ""}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    padding: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {showDealer ? (
                    <>
                      {dealerCards.map((obj, index) => (
                        <Image
                          source={cardObj[obj]}
                          style={{
                            width: 100,
                            height: 140,
                            marginLeft: index !== 0 ? -60 : 0,
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                        //   <MyComponent obj={obj} />
                        //   <Text key={index}>{require(obj)}</Text>
                      ))}
                    </>
                  ) : (
                    <>
                      {dealerCards.map((obj, index) => (
                        <Image
                          source={
                            index != 0
                              ? require("../assets/taash/backside.jpg")
                              : cardObj[obj]
                          }
                          style={{
                            width: 100,
                            height: 140,
                            marginLeft: index !== 0 ? -60 : 0,
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                        //   <MyComponent obj={obj} />
                        //   <Text key={index}>{require(obj)}</Text>
                      ))}
                    </>
                  )}
                </View>
                <View
                  style={{
                    margin: 20,
                    //   marginBottom: 0,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "white",
                      width: 100,
                      height: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 100,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 20 }}>
                      {potAmount}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Pot Amount
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      {user1Data.getName()}
                    </Text>
                    {user1Data.getScore() > 21 ? (
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          {user1Data.getCards().map((obj, index) => (
                            <Image
                              source={cardObj[obj]}
                              style={{
                                width: 82,
                                height: 114,
                                marginLeft: index !== 0 ? -60 : 0,
                                borderRadius: 5,
                              }}
                              key={index}
                            />
                          ))}
                        </View>
                        <Image
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 70,
                            marginTop: -82,
                          }}
                          source={require("../assets/taash/bust.jpg")}
                        />
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        {user1Data.getCards().map((obj, index) => (
                          <Image
                            source={cardObj[obj]}
                            style={{
                              width: 82,
                              height: 114,
                              marginLeft: index !== 0 ? -60 : 0,
                              borderRadius: 5,
                            }}
                            key={index}
                          />
                        ))}
                      </View>
                    )}

                    <Text
                      style={{
                        color: "white",
                        marginTop: user1Data.getScore() > 21 ? 35 : 20,
                        marginBottom: 20,
                      }}
                    >
                      Score : {user1Data.getScore()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      {user2Data.getName()}
                    </Text>
                    {user2Data.getScore() > 21 ? (
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          {user2Data.getCards().map((obj, index) => (
                            <Image
                              source={cardObj[obj]}
                              style={{
                                width: 82,
                                height: 114,
                                marginLeft: index !== 0 ? -60 : 0,
                                borderRadius: 5,
                              }}
                              key={index}
                            />
                          ))}
                        </View>
                        <Image
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 70,
                            marginTop: -82,
                          }}
                          source={require("../assets/taash/bust.jpg")}
                        />
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        {user2Data.getCards().map((obj, index) => (
                          <Image
                            source={cardObj[obj]}
                            style={{
                              width: 82,
                              height: 114,
                              marginLeft: index !== 0 ? -60 : 0,
                              borderRadius: 5,
                            }}
                            key={index}
                          />
                        ))}
                      </View>
                    )}

                    <Text
                      style={{
                        color: "white",
                        marginTop: user2Data.getScore() > 21 ? 35 : 20,
                        marginBottom: 20,
                      }}
                    >
                      Score : {user2Data.getScore()}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {showWinner.length == 1 ? (
              <>
                <View
                  style={{
                    // backgroundColor: "red",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 50,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 25, margin: 20 }}>
                    {showWinner[0].name} Won
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      margin: 20,
                    }}
                  >
                    {showWinner[0].cards.map((obj, index) => (
                      <Image
                        source={cardObj[obj]}
                        style={{
                          width: 101,
                          height: 141,
                          marginLeft: index !== 0 ? -60 : 0,
                          borderRadius: 5,
                        }}
                        key={index}
                      />
                      //   <MyComponent obj={obj} />
                      //   <Text key={index}>{require(obj)}</Text>
                    ))}
                  </View>

                  <Text style={{ color: "white", fontSize: 22, margin: 10 }}>
                    Hand Value : {showWinner[0].score}
                  </Text>
                  <Text style={{ color: "white", fontSize: 22, margin: 10 }}>
                    Won : {showWinner[0].winning} chips
                  </Text>
                  {showWinner[0].name == user1Data.getName() ||
                  showWinner[0].name == user2Data.getName() ? (
                    <Text style={{ color: "white", fontSize: 22, margin: 10 }}>
                      Balance : {showWinner[0].balance} chips
                    </Text>
                  ) : (
                    <></>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      nextRound();
                    }}
                    style={{
                      margin: 20,
                      marginTop: 40,
                      padding: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "white",
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Next Round
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : showWinner.length == 2 ? (
              <>
                {showWinner.map((obj, index) => (
                  <View
                    key={index}
                    style={{
                      // backgroundColor: "red",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 50,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 25, margin: 20 }}>
                      {obj.name}
                    </Text>

                    <Text style={{ color: "white", fontSize: 22, margin: 10 }}>
                      Hand Value : {obj.score}
                    </Text>
                    <Text style={{ color: "white", fontSize: 22, margin: 10 }}>
                      Won : {obj.winning} chips
                    </Text>
                    {obj.name == user1Data.getName() ||
                    obj.name == user2Data.getName() ? (
                      <Text
                        style={{ color: "white", fontSize: 22, margin: 10 }}
                      >
                        Balance : {obj.balance} chips
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                ))}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      nextRound();
                    }}
                    style={{
                      margin: 20,
                      marginTop: 60,
                      padding: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "white",
                      borderRadius: 20,
                      width: "50%",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Next Round
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : showWinner.length > 2 ? (
              <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {showWinner.map((obj, index) => (
                    <View
                      key={index}
                      style={{
                        // backgroundColor: "red",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 25,
                      }}
                    >
                      <Text
                        style={{ color: "white", fontSize: 25, margin: 20 }}
                      >
                        {obj.name}
                      </Text>

                      <Text
                        style={{ color: "white", fontSize: 22, margin: 10 }}
                      >
                        Hand Value : {obj.score}
                      </Text>
                      <Text
                        style={{ color: "white", fontSize: 22, margin: 10 }}
                      >
                        Won : {obj.winning} chips
                      </Text>
                      {obj.name == user1Data.getName() ||
                      obj.name == user2Data.getName() ? (
                        <Text
                          style={{ color: "white", fontSize: 22, margin: 10 }}
                        >
                          Balance : {obj.balance} chips
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
                  ))}
                </ScrollView>

                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      nextRound();
                    }}
                    style={{
                      margin: 20,
                      marginTop: 20,
                      padding: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "white",
                      borderRadius: 20,
                      width: "50%",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 18 }}>
                      Next Round
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <></>
            )}
          </>
        )}
      </ImageBackground>
      {/* dealer cards */}

      {/* pot */}
    </View>
  );
};

export default Game;
