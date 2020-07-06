import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SPLASH, LOGIN, HOME, PHONE_SIGN_IN} from '../constants/index';
import Splash from '../components/splash';
import Login from '../components/login';
import Home from '../components/home';
import PhoneSignIn from '../components/phoneSignIn';

const Stack = createStackNavigator();

export default class NavigationController extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={SPLASH} component={Splash} />
          <Stack.Screen name={LOGIN} component={Login} />
          <Stack.Screen name={HOME} component={Home} />
          <Stack.Screen name={PHONE_SIGN_IN} component={PhoneSignIn} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
