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
  const [currentPlayer, setCurrentPlayer] = useState(route.params.users[0]);
  const [allUsers, setAllUsers] = useState(route.params.users);
  const [totalPlayers, setTotalPlayers] = useState(route.params.users.length);
  const [potAmount, setPotAmount] = useState(0);
  const [dealerCards, setDealerCards] = useState([]);
  const [showDealer, setShowDealer] = useState(false);
  const [dealerCardCount, setDealerCardCount] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [raise, setRaise] = useState(false);
  const [dealerchips, setDealerchips] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  //[{name,cards,score,winnings}]
  const [showWinner, setShowWinner] = useState([]);
  const [deal, setDeal] = useState(1000);

  const [userCardCount, setUserCardCount] = useState(-1);

  const [showDealerPage, setShowDealerPage] = useState(false);
  const [showResultButton, setShowResultButton] = useState(false);

  useEffect(() => {
    const gameDisplay = () => {
      if (gameOver) {
        //deci
        let arrScores = dealerScore > 21 ? [] : [dealerScore];
        allUsers.map((obj) => {
          if (obj.getScore() < 22) arrScores.push(obj.getScore());
        });

        let mx = arrScores.length > 0 ? Math.max(...arrScores) : 0;
        console.log(`max - ${mx}`);
        let finalWinners = [];
        if (mx !== 21) {
          if (dealerScore == mx) {
            finalWinners.push("dealer");
          }
          allUsers.forEach((obj) => {
            if (obj.getScore() == mx) finalWinners.push(obj.getName());
          });
        } else {
          let checkBlackJacks = false;
          if (dealerCards.length == 2 && dealerScore == 21)
            checkBlackJacks = true;
          allUsers.forEach((obj) => {
            if (obj.getCards().length == 2 && obj.getScore() == 21)
              checkBlackJacks = true;
          });

          if (checkBlackJacks) {
            if (dealerScore == mx && dealerCardCount == 2)
              finalWinners.push("dealer");
            allUsers.forEach((obj) => {
              if (obj.getScore() == mx && obj.getCards().length == 2)
                finalWinners.push(obj.getName());
            });
          } else {
            if (dealerScore == mx) finalWinners.push("dealer");
            allUsers.forEach((obj) => {
              if (obj.getScore() == mx) finalWinners.push(obj.getName());
            });
          }
        }
        let potDivide =
          finalWinners.length > 0 ? finalWinners.length : allUsers.length;
        let tmpUsers = allUsers;
        for (let i = 0; i < totalPlayers; i++) {
          if (finalWinners.length == 0)
            tmpUsers[i].addCoins(Math.floor(potAmount / potDivide));
          else if (finalWinners.includes(tmpUsers[i].getName())) {
            tmpUsers[i].addCoins(Math.floor(potAmount / potDivide));
          }
        }
        if (finalWinners.includes("dealer"))
          setDealerchips(Math.floor(potAmount / potDivide));
        setAllUsers(tmpUsers);
        setShowWinner(finalWinners);
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
      if (showDealer) {
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
          // setGameOver(true);
          setTimeout(() => setShowResultButton(true), 1000);
          // setShowResultButton(true);
        }
        setDealerCardCount(cardsDealer.length);
      } else {
        setShowDealer(true);
        setDealerCardCount(-1);
      }
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
    if (tmpUser.playerNumber < totalPlayers) {
      let tmp = allUsers;
      tmp[tmpUser.playerNumber - 1] = tmpUser;
      setAllUsers(tmp);
      setCurrentPlayer(allUsers[tmpUser.playerNumber]);
    } else {
      let tmp = allUsers;
      tmp[tmpUser.playerNumber - 1] = tmpUser;
      setAllUsers(tmp);
      setCurrentPlayer(null);
      setShowDealerPage(true);
    }
  };

  const revealDealer = () => {
    setShowDealerPage(false);
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
    let tmpUsers = allUsers;
    for (let i = 0; i < totalPlayers; i++) {
      tmpUsers[i].reset();
    }
    setCurrentPlayer(tmpUsers[0]);
    setPotAmount(0);
    setGameOver(false);
    setShowWinner([]);
    setDealerCardCount(0);
    setDealerScore(0);
    setDeal(deal + 1500);
    setShowDealer(false);
    setDealerCards([]);
    setAvailableCards(cardNumbers);
    setShowDealerPage(false);
    setShowResultButton(false);
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
            ) : showDealerPage ? (
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "50%",
                    alignItems: "center",
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 20,
                  }}
                  onPress={() => {
                    revealDealer();
                  }}
                >
                  <Text style={{ fontSize: 18, color: "white" }}>
                    Reveal Dealer Cards
                  </Text>
                </TouchableOpacity>
              </View>
            ) : showResultButton ? (
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "50%",
                    alignItems: "center",
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 20,
                  }}
                  onPress={() => {
                    setShowResultButton(false);
                    setGameOver(true);
                    // allUsers.forEach((obj) => {
                    //   console.log(JSON.stringify(obj));
                    // });
                  }}
                >
                  <Text style={{ fontSize: 18, color: "white" }}>
                    Show Results
                  </Text>
                </TouchableOpacity>
              </View>
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
              </>
            )}
          </>
        ) : (
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // width: "90%",
              padding: 5,
              marginTop: 10,
              marginRight: 10,
              marginLeft: 10,
              marginBottom: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: "100%",
                marginTop: 30,
                // marginLeft: 20,
                borderWidth: 1,
                borderColor: "white",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text style={{ color: "white", width: "30%", fontSize: 18 }}>
                  Name
                </Text>
                <Text style={{ color: "white", width: "20%", fontSize: 18 }}>
                  Score
                </Text>
                <Text style={{ color: "white", width: "30%", fontSize: 18 }}>
                  Chips
                </Text>
                <Text
                  style={{
                    color: "white",
                    width: "20%",
                    fontSize: 18,
                  }}
                >
                  Result
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "white",
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "white", width: "30%", fontSize: 18 }}>
                  Dealer
                </Text>
                <Text style={{ color: "white", width: "20%", fontSize: 18 }}>
                  {dealerScore}
                </Text>
                <Text
                  style={{
                    color: "white",
                    width: "30%",
                    fontSize: 18,
                  }}
                >
                  {dealerchips}
                </Text>
                <Text
                  style={{
                    color: "white",
                    width: "20%",
                    fontSize: 18,
                  }}
                >
                  {dealerScore > 21 ? (
                    "Bust"
                  ) : showWinner.includes("dealer") ? (
                    <Text>&#x1F389;</Text>
                  ) : (
                    <Text>&#x1F622;</Text>
                  )}
                </Text>
              </View>
              {allUsers.map((obj, ind) => (
                <View
                  key={ind}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // marginTop: 20,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: "white", width: "30%", fontSize: 18 }}>
                    {obj.getName()}
                  </Text>
                  <Text style={{ color: "white", width: "20%", fontSize: 18 }}>
                    {obj.getScore()}
                  </Text>
                  <Text style={{ color: "white", width: "30%", fontSize: 18 }}>
                    {obj.getCoinBalance()}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      width: "20%",
                      fontSize: 18,
                    }}
                  >
                    {obj.getScore() > 21 ? (
                      "Bust"
                    ) : showWinner.includes(obj.getName()) ? (
                      <Text>&#x1F389;</Text>
                    ) : (
                      <Text>&#x1F622;</Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Text style={{ fontSize: 20, color: "white" }}>Cards</Text>
            </View>
            <View style={{ width: "100%", marginTop: 10, marginLeft: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                >
                  <Text style={{ fontSize: 15, color: "white" }}>Dealer</Text>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
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
                    ))}
                  </View>
                </View>
                {allUsers.map((obj, ind) => (
                  <View
                    key={ind}
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <Text style={{ fontSize: 15, color: "white" }}>
                      {obj.getName()}
                    </Text>
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {obj.getCards().map((obj1, index) => (
                        <Image
                          source={cardObj[obj1]}
                          style={{
                            width: 100,
                            height: 140,
                            marginLeft: index !== 0 ? -60 : 0,
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ marginTop: 30, marginBottom: 50, width: "50%" }}>
              <TouchableOpacity
                onPress={() => {
                  nextRound();
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "white",
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 15, color: "white" }}>Next Round</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </ImageBackground>
    </View>
  );
};

export default Game;
