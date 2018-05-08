import _ from 'lodash'
import './polyfill';
import './api';
global._ = _;
import 'react-native-globals'; //Adds <View etc to global scope
import {globalise} from '../components/base-components'; //Adds <Flex,Row,Container etc
globalise();