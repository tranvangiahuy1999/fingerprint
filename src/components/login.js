import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

import styles from '../style/style';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import {Button} from 'react-native-elements';

import {HOME, PHONE_SIGN_IN} from '../constants/index';
import perNoti from '../functions/permissionTokenNotification';

GoogleSignin.configure({
  webClientId:
    '426636965076-fhobtidq0r94hglbs9bung2i62bor9o5.apps.googleusercontent.com',
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoggedIn: false,
      errorMessage: null,
    };
  }

  componentDidMount() {
    perNoti.checkPermission();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>Fingerprint</Text>
              <TextInput
                placeholder="Email"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
              />
              <TextInput
                placeholder="Password"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                secureTextEntry={true}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => {
                  this._onLoginPress();
                }}
                title="Login with Firebase"
              />

              <Button
                title="Facebook Sign-In"
                onPress={() =>
                  this.onFacebookButtonPress().then(() =>
                    console.log('Signed in with Facebook!'),
                  )
                }
              />

              <Button
                title="Google Sign-In"
                onPress={() =>
                  this.onGoogleButtonPress().then(() =>
                    console.log('Signed in with Google!'),
                  )
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  async onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    console.log('idToken', idToken);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth()
      .signInWithCredential(googleCredential)
      .then(() => {
        this.props.navigation.replace(PHONE_SIGN_IN);
      })
      .catch((e) => console.log(e));
  }

  async onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth()
      .signInWithCredential(facebookCredential)
      .then(() => {
        this.props.navigation.replace(PHONE_SIGN_IN);
      })
      .catch((e) => console.log(e));
  }

  _onLoginPress() {
    const {email, password} = this.state;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this._storeData();
      })
      .then(() => {
        console.log('Signed in!');
        this.props.navigation.replace(PHONE_SIGN_IN);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  _storeData = async () => {
    const {email, password} = this.state;
    try {
      let md5email = this._convertMd5(email);
      let md5password = this._convertMd5(password);

      const data = [
        ['@Email', JSON.stringify(md5email)],
        ['@Password', JSON.stringify(md5password)],
      ];

      await AsyncStorage.multiSet(data);
    } catch (e) {
      console.log(e);
    }
  };

  _convertMd5 = (string) => {
    var md5 = require('md5');
    return md5(string);
  };
}
