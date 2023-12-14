/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, View } from 'react-native';
import { Button } from 'react-native-paper';
import base64 from 'react-native-base64';

const BluetoothDemo = () => {
  const [devices, setDevices] = useState(new Set());
  const manager = new BleManager();


  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      checkPermissions();
    }
  }, []);

  // checkPermissions ve scanAndConnect fonksiyonları aynı kalır

  const checkPermissions = async () => {
    try {
      const permissions = [
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.BLUETOOTH_SCAN',
      ];
      const rationale = {
        title: 'Bluetooth İzni',
        message: 'Uygulamanın düzgün çalışması için Bluetooth iznine ihtiyacı var',
        buttonNeutral: 'Daha Sonra Sor',
        buttonNegative: 'İptal',
        buttonPositive: 'Tamam',
      };
      for (let i = 0; i < permissions.length; i++) {
        const hasPermission = await PermissionsAndroid.check(permissions[i]);
        if (!hasPermission) {
          const status = await PermissionsAndroid.request(permissions[i], rationale);
          if (status !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Kullanıcı izin vermedi');
            return;
          }
        }
      }
      console.log('Tüm izinler verildi');
    } catch (err) {
      console.warn(err);
    }
  };

  const scanAndConnect = () => {
    console.log('Baglantı kuruluyor...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device) {
        console.log(`Device found: ${device.name}`);
      }
      if (device.name === 'MyESP322') {


        device
          .connect()
          .then(device => {
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            // Do work on device with services and characteristics
            return device.writeCharacteristicWithResponseForService('4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('Hello!'));
          })
          .then((characteristic) => {
            console.log('Message sent');
          })
          .catch((error) => {
            console.log(error);
          });

        manager.stopDeviceScan();
        console.log(`Device found: ${device.name}`);
        console.log(`ID: ${device.id}`);
        console.log(`RSSI: ${device.rssi}`);
        console.log(`Connected: ${device.connected}`);
        console.log(`Services: ${device.services}`);
        console.log('Stop scanning');

        // Proceed with connection.
      }
    });
  };
  return (
    <View>
      <Button mode="contained" onPress={() => {
        scanAndConnect();
      }}>Tara</Button>
      <Button mode="contained" onPress={async () => {
        try {
          await manager.writeCharacteristicWithResponseForDevice('E8:31:CD:FC:26:86', '4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('forward'));
        } catch (error) {
          console.log(error);
        }
      }}>Forward</Button>

      <Button mode="contained" onPress={async () => {
        try {
          await manager.writeCharacteristicWithResponseForDevice('E8:31:CD:FC:26:86', '4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('backward'));
        } catch (error) {
          console.log(error);
        }
      }}>Backward</Button>

      <Button mode="contained" onPress={async () => {
        try {
          await manager.writeCharacteristicWithResponseForDevice('E8:31:CD:FC:26:86', '4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('right'));
        } catch (error) {
          console.log(error);
        }
      }}>Right</Button>

      <Button mode="contained" onPress={async () => {
        try {
          await manager.writeCharacteristicWithResponseForDevice('E8:31:CD:FC:26:86', '4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('left'));
        } catch (error) {
          console.log(error);
        }
      }}>Left</Button>


    </View>
  );
};

export default BluetoothDemo;
