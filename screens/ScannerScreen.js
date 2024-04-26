import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { BackHandler } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScannerScreen = (props) => {
  BackHandler.addEventListener("hardwareBackPress", () => {
    return true;
  });

  const { fileName, date } = props.route.params;

  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const [code, setCode] = useState("");
  const [sr, setSr] = useState(1);
  const [scanned, setScanned] = useState(false);
  const [toggleInput, setToggleInput] = useState(false); //true == text input 2 ; false ==  text input 1
  const [excelSheetData, setExcelSheetData] = useState([]);
  const [draftData, setDraftData] = useState([]);

  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");



  const clearSpecificDraft = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
    setLoadData((value) => !value);
  };

  const getData = async (key) => {
    try {
      let prevExcelData, resumeIndex;
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        prevExcelData = JSON.parse(value);
        resumeIndex = prevExcelData[prevExcelData.length - 1].Sr;
        resumeIndex = parseInt(resumeIndex);
        setSr(resumeIndex + 1);
        setExcelSheetData(prevExcelData);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData(fileName);
  }, []);

  //to store draft everytime submission
  useEffect(() => {
    storeDraft(fileName, excelSheetData);
  }, [excelSheetData]);

  const storeDraft = async (fileName, excelData) => {
    console.log("saving..");
    try {
      await AsyncStorage.setItem(fileName, JSON.stringify(excelData));
    } catch (e) {
      console.log(e);
    }
  };

  const next = () => {
    setScanned(false);
    setCode("");
    setToggleInput((prev) => !prev);
  };

  const makeDraft = () => {
    storeDraft(fileName, excelSheetData);
    props.navigation.replace("Home");
  };

  const submit = () => {
    if (t1.trim().length > 0 && t2.trim().length > 0) {
      setSr((value) => value + 1);
      var hours = new Date().getHours();
      var min = new Date().getMinutes();
      var time = hours + ":" + min;
      setExcelSheetData((excelSheetData) => [
        ...excelSheetData,
        { Sr: sr, "Pickslip No": t1, "Order No": t2, Time: time },
      ]);

      setScanned(false);
      setToggleInput(false);
      setT1("");
      setT2("");
    } else {
      Alert.alert("Input field is empty", "Try scanning some codes", [
        { text: "Okay" },
      ]);
    }
  };

  const createExcel = async () => {
    if (excelSheetData.length === 0) {
      Alert.alert("Try Adding Some Codes.", "Excel sheet is empty", [
        { text: "Okay" },
      ]);
    } else {
      clearSpecificDraft(fileName);
      var ws = XLSX.utils.json_to_sheet(excelSheetData);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${fileName}`);
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });
      const uri = FileSystem.cacheDirectory + `${fileName} - ${date}.xlsx`;
      console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "MyWater data",
        UTI: "com.microsoft.excel.xlsx",
      });
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (code === data) {
      Alert.alert("Same QR", "The code is similar to your previous one", [
        { text: "Okay" },
      ]);
    } else {
      if (toggleInput) {
        setT2(data);
      } else {
        setT1(data);
      }
    }
  };



  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: screenHeight * 0.07 }}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <AntDesign
          onPress={() => {
            props.navigation.replace("Home");
          }}
          style={{ padding: 15 }}
          name="back"
          size={24}
          color="#ffffff"
        />
        <Text style={styles.headerText}>File Name : {fileName}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          setScanned((prev) => !prev);
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{
            height: screenHeight * 0.5,
            width: screenWidth * 0.65,
            alignSelf: "center",
            borderWidth: 1,
            padding: 10,
            backgroundColor: scanned ? "#ff5959" : "#7bff61",
          }}
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          onPressIn={() => {
            setToggleInput(false);
          }}
          placeholder={"Pickslip No"}
          placeholderTextColor="#555e5e"
          caretHidden={!scanned}
          style={{
            ...styles.input,
            borderColor: !toggleInput ? "#b8fffa" : "#56e5db",
            color: !toggleInput ? "#b8fffa" : "#56e5db",
            borderWidth: !toggleInput ? 2 : 1,
          }}
          onChangeText={setT1}
          value={t1}
          onSubmitEditing={() => {
            ref_input2.current.focus(), setToggleInput((prev) => !prev);
          }}
          ref={ref_input1}
          blurOnSubmit={false}
        />
        <TextInput
          onPressIn={() => {
            setToggleInput(true);
          }}
          caretHidden={!scanned}
          placeholderTextColor="#555e5e"
          placeholder={"Order No"}
          ref={ref_input2}
          style={{
            ...styles.input,
            borderColor: toggleInput ? "#b8fffa" : "#56e5db",
            color: toggleInput ? "#b8fffa" : "#56e5db",
            borderWidth: toggleInput ? 2 : 1,
          }}
          onChangeText={setT2}
          onSubmitEditing={() => {
            ref_input1.current.focus(), setToggleInput((prev) => !prev);
          }}
          value={t2}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.scannBContainer}>
        <TouchableOpacity
          style={{ ...styles.buttonContainer, width: "30%" }}
          onPress={next}
        >
          <Text style={styles.button}>Scan Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.buttonContainer,
            width: "30%",
            borderColor: "yellow",
          }}
          onPress={makeDraft}
        >
          <Text style={{ ...styles.button, color: "yellow" }}>Draft</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scannBContainer}>
        <TouchableOpacity
          style={{ ...styles.buttonContainer, width: "30%" }}
          onPress={submit}
        >
          <Text style={styles.button}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.buttonContainer,
            width: "30%",
            borderColor: "#7bff61",
          }}
          onPress={createExcel}
        >
          <Text style={{ ...styles.button, color: "#7bff61" }}>Finish</Text>
        </TouchableOpacity>
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
  input: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    paddingTop: 20,
  },
  button: {
    color: "#56e5db",
    alignSelf: "center",
    fontWeight: "200",
    fontSize: 17,
  },
  buttonContainer: {
    borderWidth: 0.5,
    borderColor: "#56e5db",
    padding: 10,
    position: "relative",
    alignSelf: "center",
    borderRadius: 10,
    width: "50%",
    marginVertical: 10,
  },
  scannBContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    flexDirection: "row",
  },
  headerText: {
    color: "#969696",
  },
});

export default ScannerScreen;
