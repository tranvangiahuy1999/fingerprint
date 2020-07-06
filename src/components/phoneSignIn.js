import React, {Component} from 'react';
import {Button, TextInput, View, AsyncStorage, Image, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {HOME} from '../constants/index';
import perNoti from '../functions/permissionTokenNotification';

export default class PhoneSignIn extends Component {
  // If null, no SMS has been sent
  constructor(props) {
    super(props);
    this.state = {
      confirm: null,
      verificationCode: '',
      countryCode: '+84',
      phoneNumber: '',
      userId: '',
    };
  }

  componentDidMount() {
    perNoti.checkPermission();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.confirm ? (
          <View>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                marginTop: 150,
                marginBottom: 30,
                textAlign: 'center',
              }}>
              Phone Authencation
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 30, height: 30, margin: 2}}
                source={{
                  uri:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png',
                }}></Image>
              <Text style={{margin: 2}}>{this.state.countryCode}</Text>
              <TextInput
                style={{margin: 2}}
                placeholder={'090-274-7494'}
                value={this.state.phoneNumber}
                onChangeText={(text) =>
                  this.setState({phoneNumber: text})
                }></TextInput>
            </View>
            <Button
              title="Phone Number Sign In"
              onPress={() => this.signInWithPhoneNumber()}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '800',
                marginTop: 150,
                marginBottom: 30,
                textAlign: 'center',
              }}>
              Phone Authencation
            </Text>
            <TextInput
              placeholder={'Enter 6 digits number'}
              value={this.state.verificationCode}
              onChangeText={(text) => this.setState({verificationCode: text})}
            />
            <Button title="Confirm Code" onPress={() => this.confirmCode()} />
          </View>
        )}
      </View>
    );
  }

  // Handle the button press
  async signInWithPhoneNumber() {
    var number = this.state.countryCode + this.state.phoneNumber;
    console.log(number);
    await auth()
      .signInWithPhoneNumber(number)
      .then((confirmation) => {
        console.log('confirmResult', confirmation.confirm);
        this.setState({confirm: confirmation});
      })
      .catch((e) => console.log(e));
  }

  async confirmCode() {
    const confirmResult = this.state.confirm;
    await confirmResult
      .confirm(this.state.verificationCode)
      .then(async () => {
        console.log('Logged In');
        await this._storeData();
        this.props.navigation.replace(HOME);
      })
      .catch((e) => console.log(e));
  }

  _storeData = async () => {
    var number = this.state.countryCode + this.state.phoneNumber;
    try {
      let numberMd5 = this._convertMd5(number);
      await AsyncStorage.setItem('@Number', JSON.stringify(numberMd5));
    } catch (e) {
      console.log(e);
    }
  };

  _convertMd5 = (string) => {
    var md5 = require('md5');
    return md5(string);
  };
}
