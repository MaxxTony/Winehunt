import {LogBox} from 'react-native';

if (__DEV__) {
  const ignoreWarns = [
    'EventEmitter.removeListener',
    '[fuego-swr-keys-from-collection-path]',
    'Setting a timer for a long period of time',
    'ViewPropTypes will be removed from React Native',
    'AsyncStorage has been extracted from react-native',
    "exported from 'deprecated-react-native-prop-types'.",
    'Non-serializable values were found in the navigation state.',
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Each child in a list should have a unique "key" prop.',
    'Animated.event now requires a second argument for options at Collapse',
    "ReactImageView: Image source null doesn't exist",
    'Warning: Each child in a list should have a unique',
  ];

  // const warn = console.warn;
  // console.warn = (...arg) => {
  //   for (const warning of ignoreWarns) {
  //     if (arg[0].startsWith(warning)) {
  //       return;
  //     }
  //   }
  //   warn(...arg);
  // };

  LogBox.ignoreLogs(ignoreWarns);
}
