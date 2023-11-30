import React from "react";
import { View, StyleSheet } from "react-native";
import  IconButton  from "react-native-paper";

const ControlPage = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.centerContainer}>
        <IconButton icon="arrow-up" size={50} color="red" onPress={() => console.log("Go up!")}/>
      </View>

      <View style={styles.rowContainer}>
        <IconButton icon="arrow-left" size={50} color="red" onPress={() => console.log("Go left!")}/>
        <IconButton icon="arrow-right" size={50} color="red" onPress={() => console.log("Go right!")}/>
      </View>

      <View style={styles.centerContainer}>
        <IconButton icon="arrow-down" size={50} color="red" onPress={() => console.log("Go down!")}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: 10,
  },
});

export default ControlPage;