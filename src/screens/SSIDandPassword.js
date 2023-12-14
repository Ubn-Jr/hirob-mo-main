import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import WiFiManager from 'react-native-wifi-reborn';
import BleManager from 'react-native-ble-manager';

export default function App() {
  const [wifiList, setWifiList] = useState([]);
  const [connectedSSID, setConnectedSSID] = useState('');
  const [espConnected, setEspConnected] = useState(false);
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [espDeviceId, setEspDeviceId] = useState(null);

  // ESP cihazı ve BLE ile ilgili sabitler
  const ESP_DEVICE_NAME = 'ESP_DEVICE_NAME'; // ESP cihazınızın adı
  const SERVICE_UUID = 'YOUR_SERVICE_UUID'; // Servis UUID
  const CHARACTERISTIC_UUID = 'YOUR_CHARACTERISTIC_UUID'; // Karakteristik UUID

  useEffect(() => {
    scanWifi(); // Sayfa yüklendiğinde Wi-Fi ağlarını tarar
    BleManager.start(); // BLE Manager'ı başlat
  }, []);

  const scanWifi = async () => {
    try {
      const wifiArray = await WiFiManager.loadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToWifi = async (selectedSSID, selectedPassword) => {
    try {
      await WiFiManager.connectToProtectedSSID(selectedSSID, selectedPassword, false, false, false);
      console.log('Connected to WiFi:', selectedSSID);
      setConnectedSSID(selectedSSID);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToESP = async () => {
    try {
      const peripherals = await BleManager.scan([], 5, true); // 5 saniye süreyle tarama yapar
      const espDevice = peripherals.find(device => device.name === ESP_DEVICE_NAME);
      if (espDevice) {
        await BleManager.connect(espDevice.id); // ESP cihazına bağlanır
        setEspConnected(true);
        setEspDeviceId(espDevice.id);
      } else {
        console.log('ESP cihazı bulunamadı.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendWifiCredentialsToESP = async () => {
    if (!espConnected || !espDeviceId) {
      console.log('Önce ESP modülüne bağlanmalısınız.');
      return;
    }

    try {
      const data = new TextEncoder().encode(`${ssid}\n${password}`); // SSID ve şifreyi kodlar
      await BleManager.write(espDeviceId, SERVICE_UUID, CHARACTERISTIC_UUID, data); // ESP'ye bilgileri gönderir
      console.log('WiFi bilgileri ESP modülüne gönderildi.');
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>SSID: {item.SSID}</Text>
      <Button
        title="Connect"
        onPress={() => connectToWifi(item.SSID, password)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter SSID"
        value={ssid}
        onChangeText={setSSID}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Scan WiFi"
        onPress={scanWifi}
      />
      <FlatList
        data={wifiList}
        renderItem={renderItem}
        keyExtractor={(item) => item.BSSID}
      />
      <Button
        title="Connect to ESP"
        onPress={connectToESP}
      />
      <Button
        title="Send WiFi Credentials to ESP"
        onPress={sendWifiCredentialsToESP}
        disabled={!espConnected}
      />

      {connectedSSID !== '' && (
        <Text>Connected to WiFi: {connectedSSID}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
