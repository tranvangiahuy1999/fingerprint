import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from 'react-native';

import {LOGIN, HOME, PHONE_SIGN_IN} from '../constants/index';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      email: '',
      password: '',
      number: '',
    };
  }

  async componentDidMount() {
    await this._retrieveData();
    console.log('email', this.state.email);
    setTimeout(() => this.checkUsed(), 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading</Text>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }

  _retrievePhoneData = async () => {
    try {
      const data = await AsyncStorage.getItem('@Number');
      if (data !== null) {
        // We have data!!
        this.setState({
          number: JSON.parse(data),
        });
        console.log(JSON.parse(data));
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  _retrieveData = async () => {
    try {
      await AsyncStorage.multiGet(['@Email', '@Password']).then((response) => {
        console.log(response[0][0], JSON.parse(response[0][1])); // k1, v1
        console.log(response[1][0], JSON.parse(response[1][1])); // k2, v2
        this.setState({
          email: JSON.parse(response[0][1]),
          password: JSON.parse(response[1][1]),
          isLoading: false,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  checkUsed() {
    if (
      this.state.email !== '' &&
      this.state.email !== undefined &&
      this.state.email !== null &&
      this.state.password !== '' &&
      this.state.password !== undefined &&
      this.state.password !== null
      //   ||
      // (this.state.number !== '' &&
      //   this.state.number !== undefined &&
      //   this.state.number !== null)
    ) {
      this.props.navigation.replace(HOME);
    } else {
      this.props.navigation.replace(LOGIN);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
