import React, {Component} from 'react';
import {View, Text, Alert, Platform} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined,
    };

    this.description = null;
  }

  componentDidMount() {
    this.authCurrent();
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  };

  authCurrent() {
    FingerprintScanner.authenticate({title: 'Log in with Biometrics'})
      .then((id) => {
        console.log('id', id);
        Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
      })
      .catch((e) => console.log('error', e));
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>React Native Fingerprint Scanner</Text>
        <Text>Scanning...</Text>
      </View>
    );
  }
}
