import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";

// Ana Ekran Bileşeni
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      {/* "Detay Ekranına Geç" düğmesi */}
      <Button onPress={() => navigation.navigate("Details")}> Detay Ekranına Geç </Button>
    </View>
  );
}

// Detay Ekran Bileşeni
function DetailsScreen({ navigation}) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      {/* "Ana Sayfaya Geç" düğmesi */}
      <Button onPress={() => navigation.navigate("Home")}> Ana Sayfaya Geç </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    // Navigation Container sayesinde sayfalar arası geçiş yapılıyor.
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Ana Ekran ve Detay Ekran bileşenleri */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
