/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './components/redux/store';

const appRedux = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};


AppRegistry.registerComponent(appName, () => appRedux);
