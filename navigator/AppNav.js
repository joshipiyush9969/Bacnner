import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {View} from 'react-native'

//screens
import HomeScreen from '../screens/HomeScreen'
import DownloadScreen from "../screens/DownloadScreen";
import ScannerScreen from "../screens/ScannerScreen";
import DraftScreen from "../screens/DraftScreen";

const AppStack = createStackNavigator();

const FirstNavigator = () => {
    return (
      <AppStack.Navigator
        initialRouteName={"Home"}
        screenOptions={{ headerShown: false, presentation: "modal" }}
      >
        <AppStack.Screen name="Home" component={HomeScreen} />
        <AppStack.Screen name="Scanner" component={ScannerScreen} />
        <AppStack.Screen name="Download" component={DownloadScreen} />
        <AppStack.Screen name="Draft" component={DraftScreen} />
      </AppStack.Navigator>
    );
}

const FlowStack = createStackNavigator()

const AppNav = () => {
    return (
      
        <NavigationContainer>
          <FlowStack.Navigator
            screenOptions={{ headerShown: false,presentation:'modal' }}
          >
            <FlowStack.Screen name="First" component={FirstNavigator} />
          </FlowStack.Navigator>
        </NavigationContainer>
     
    );
}

export default AppNav