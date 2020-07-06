import React from 'react';
import {View} from 'react-native';
import NavigationController from './src/navigation/navigationController';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  var PushNotification = require('react-native-push-notification');
  messaging().onMessage(async (remoteMessage) => {
    alert('A new FCM message arrived!');
    PushNotification.localNotification({
      vibrate: true,
      vibration: 300,
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
    });
    console.log('response', JSON.stringify(remoteMessage));
  });

  return (
    <View style={{flex: 1}}>
      <NavigationController />
    </View>
  );
}
