import Promise from 'promise-polyfill';
import 'whatwg-fetch';
import {AsyncStorage, AppState, NetInfo, Clipboard} from 'pollyfill-react-native';

window.AppState = AppState;
window.NetInfo = NetInfo;
window.Clipboard = Clipboard;
window.AsyncStorage = AsyncStorage;

// To add to window
if (!window.Promise) {
    window.Promise = Promise;
}

//Object Assign
if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) {
        'use strict';
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}