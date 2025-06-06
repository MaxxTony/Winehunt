import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

const showError = message => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: 'Error',
    textBody: message,
    autoClose: 1000,
  });
};
const showWarning = message => {
  Toast.show({
    type: ALERT_TYPE.WARNING,
    title: 'Warning',
    textBody: message,
    autoClose: 1000,
  });
};
const showSucess = message => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Success',
    textBody: message,
    autoClose: 1000,
  });
};

export {showError, showWarning, showSucess};
