import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons"; 

const HomeScreen = ({ navigation }) => {
  const [fileName, setFileName] = useState("");
    const [permission, setHasPermission] = useState();
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }, []);
  const fromDraft = () => {
    console.log("Choosing from drafts")
    navigation.navigate("Draft");
  }

  const toScanner = () => {
    if (fileName.trim().length > 0) {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        
        let FinalDate = date + "-" + month + '-' + year 
      navigation.navigate("Scanner",{fileName:fileName, date:FinalDate});
    } else {
      Alert.alert(
        "Input field is empty",
        "Enter the name of the file you want to save in",
        [{ text: "Okay" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Bacnner</Text>
      <View style={styles.lotiView}>
        <LottieView
          source={require("../assets/Animations/start_scan.json")}
          autoPlay={true}
          loop={true}
          
        />
      </View>
      <TouchableOpacity style={styles.textContainer} onPress={toScanner}>
        <Text style={styles.button}>Start Scanning</Text>
      </TouchableOpacity>
      <TextInput
        placeholderTextColor={"#525c5c"}
        placeholder={"File name must be unique"}
        style={styles.input}
        onChangeText={setFileName}
        value={fileName}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        style={{
          ...styles.textContainer,
          top: Dimensions.get("window").height * 0.5789,
        }}
        onPress={fromDraft}
      >
        <Text style={{ ...styles.button, fontSize: 13 }}>
          Choose From Drafts{" "}
          <Ionicons name="chevron-forward" size={13} color="#56e5db" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c2c",
  },
  appName: {
    alignSelf: "center",
    top: Dimensions.get("window").height * 0.2,
    fontSize: 40,
    color: "#56e5db",
  },
  textContainer: {
    borderWidth: 0.5,
    borderColor: "#56e5db",
    padding: 10,
    position: "absolute",
    alignSelf: "center",
    top: Dimensions.get("window").height * 0.5,
    borderRadius: 10,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    top: Dimensions.get("window").height * 0.39,
    alignSelf: "center",
    width: "90%",
    color: "#56e5db",
    borderColor: "#525c5c",
  },
  button: {
    color: "#56e5db",
    alignSelf: "center",
    fontWeight: "200",
  },
  lotiView: {
    height: Dimensions.get("window").height,
    marginTop: Dimensions.get("window").height * -0.34,
    left: Dimensions.get("window").width*0.001,
  },
});

export default HomeScreen;
