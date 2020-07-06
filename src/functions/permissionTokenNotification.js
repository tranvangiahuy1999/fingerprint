import messaging from '@react-native-firebase/messaging';
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

class permissionTokenNotification extends Component {
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      this.requestPermission();
    }
  }

  async requestPermission() {
    console.log('requestPermission');
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('getToken', fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log('token = ', fcmToken);
      if (fcmToken) {
        // save token id to device
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
}

const perNoti = new permissionTokenNotification();
export default perNoti;
