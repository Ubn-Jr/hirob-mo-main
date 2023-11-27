
/* eslint-disable no-shadow */
/* eslint-disable quotes */
import React, { Component } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, View, Button, FlatList, Text } from 'react-native';
import base64 from 'react-native-base64';



export default class App extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
      devices: [], // Cihaz listesi
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      this.checkPermissions();
    }
  }

  async checkPermissions() {
    try {
      const permissions = [
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.BLUETOOTH_SCAN',
      ];
      const rationale = {
        title: "Bluetooth İzni",
        message: "Uygulamanın düzgün çalışması için Bluetooth iznine ihtiyacı var",
        buttonNeutral: "Daha Sonra Sor",
        buttonNegative: "İptal",
        buttonPositive: "Tamam",
      };
      for (let i = 0; i < permissions.length; i++) {
        const hasPermission = await PermissionsAndroid.check(permissions[i]);
        if (!hasPermission) {
          const status = await PermissionsAndroid.request(permissions[i], rationale);
          if (status !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Kullanıcı izin vermedi");
            return;
          }
        }
      }
      console.log("Tüm izinler verildi");
    } catch (err) {
      console.warn(err);
    }
  }


  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      // Tarayıcıdan gelen cihazları listeye ekleyin
      if (!this.state.devices.find((existingDevice) => existingDevice.id === device.id)) {
        this.setState((prevState) => ({
          devices: [...prevState.devices, device],
        }));
      }
      if (device.name === 'MyESP32') {


        device
          .connect()
          .then(device => {
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            // Do work on device with services and characteristics
            console.log("Device connected");


            return device.writeCharacteristicWithResponseForService('4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8', base64.encode('Hello!'));
          })
          .then((characteristic) => {
            console.log("Message sent");
          })
          .catch((error) => {
            console.log(error);
          });
        // device.services().then(services => {
        //   services.forEach(service => {
        //     console.log(`Service: ${service.uuid}`);
        //     service.characteristics().then(characteristics => {
        //       characteristics.forEach(characteristic => {
        //         console.log(`Characteristic: ${characteristic.uuid}`);
        //       });
        //     });
        //   });
        // });

        // })
        // .catch(error => {
        //   // Handle errors
        //   console.log(error);
        // })


        this.manager.stopDeviceScan();
        console.log(`Device found: ${device.name}`);
        console.log(`ID: ${device.id}`);
        console.log(`RSSI: ${device.rssi}`);
        console.log(`Connected: ${device.connected}`);
        console.log(`Services: ${device.services}`);
        console.log("Stop scanning");

        // Proceed with connection.
      }
    });
  }

  render() {
    return (
      <View>
        <Button title="Tara" onPress={() => this.scanAndConnect()} />
        <FlatList
          data={this.state.devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              {item.name ? <Text>{`ID: ${item.id}, Name: ${item.name}`}</Text> : null}

            </View>
          )}
        />
      </View>
    );
  }
}
