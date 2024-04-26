import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Alert,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DraftScreen = (props) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const useDraft = (key) => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    let FinalDate = date + "-" + month + "-" + year;
    props.navigation.replace("Scanner", { fileName: key, date: FinalDate });
  };

  useEffect(() => {
    getDrafts();
  }, []);

  const getDrafts = async () => {
    setLoading(true);
    let key;
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i].length; j++) {}
        key = result[i][0];
        setKeys(keys);
        console.log(keys);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const clearAllAlert = () => {
    Alert.alert("Warning", `You're about to delete all the files`, [
      { text: "Okay", onPress: () => clearAsyncStorage() },
      { text: "Deny", onPress: () => console.log('deny') },
    ]);
  };

  const clearSpecificAlert = (key) => {
        Alert.alert("Warning", `You're about to delete ${key}`, [
          { text: "Okay", onPress: () => clearSpecificDraft(key) },
          { text: "Deny", onPress: () => console.log("deny") },
        ]);
  }
  const clearAsyncStorage = async () => {
    console.log('deleting all')
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    }

    props.navigation.replace("Home");
  };

  const clearSpecificDraft = async (key) => {
    try {
      const remaining_keys = keys.filter((x) => x !== key);
      await AsyncStorage.removeItem(key);
      console.log("remaining Keys =>", remaining_keys);
      setKeys(remaining_keys);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        useDraft(item);
      }}
      style={styles.subContainer}
    >
      <Text
        style={{
          color: "white",
          marginRight: screenWidth * 0.05,
          width: "70%",
        }}
      >
        {item}
      </Text>
      <TouchableOpacity
        onPress={() => {
          clearSpecificAlert(item);
        }}
      >
        <MaterialCommunityIcons name="delete-outline" size={27} color="red" />
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: screenHeight * 0.07 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <AntDesign
          onPress={() => {
            props.navigation.replace("Home");
          }}
          style={{ padding: 15 }}
          name="back"
          size={24}
          color="#ffffff"
        />
        <TouchableOpacity onPress={clearAllAlert} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.draftContainer}>
        <Text style={styles.heading}>My Drafts</Text>
        {keys.length > 0 ? (
          <FlatList
            data={keys}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <Text style={styles.nullText}>No Drafts Found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c2c",
    paddingTop: screenHeight * 0.03,
  },
  draftContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: screenHeight * 0.05,
  },
  heading: {
    color: "#56e5db",
    fontSize: 20,
    paddingBottom: screenHeight * 0.05,
  },
  singleDraftContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#287a75",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    borderColor: "#287a75",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  nullText: {
    color: "#ddd",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: screenHeight * 0.01,
  },
  buttonText: {
    color: "#ff5959",
  },
  deleteButton: {
    borderColor: "#ff5959",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
});

export default DraftScreen;
