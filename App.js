import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, TextInput, StyleSheet } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

export default function App() {
  const [wifiList, setWifiList] = useState([]);
  const [connectedSSID, setConnectedSSID] = useState('');
  const [passwords, setPasswords] = useState({}); // Her SSID için şifreleri saklamak üzere

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Location permission granted');
        scanWifi();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const scanWifi = async () => {
    try {
      const wifiArray = await WifiManager.reScanAndLoadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToWifi = async (ssid) => {
    try {
      const password = passwords[ssid] || '';
      const response = await WifiManager.connectToProtectedSSID(ssid, password, false, false, false);
      console.log('Connected to WiFi:', ssid);
      setConnectedSSID(ssid);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePassword = (ssid, password) => {
    setPasswords(prevPasswords => ({ ...prevPasswords, [ssid]: password }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>SSID: {item.SSID}</Text>
      <TextInput 
        style={styles.textInput}
        onChangeText={(text) => updatePassword(item.SSID, text)}
        value={passwords[item.SSID] || ''}
        placeholder="Enter WiFi Password"
        secureTextEntry
      />
      <Button
        title="Connect"
        onPress={() => connectToWifi(item.SSID)}
      />
    </View>
  );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={wifiList}
        renderItem={renderItem}
        keyExtractor={(item) => item.BSSID}
        ListHeaderComponent={() => (
          <Button title="Scan WiFi" onPress={scanWifi} />
        )}
      />

      {connectedSSID !== '' && (
        <View style={{ marginTop: 20 }}>
          <Text>Connected to WiFi: {connectedSSID}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
});
