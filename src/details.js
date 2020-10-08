import React from "react";
import {

    View,
    Text,

} from 'react-native';

import { WebView } from 'react-native-webview';

const App = ({ route, navigation }) => {
    return (
        <WebView
            source={{
                uri: route.params.item
            }}
            style={{ marginTop: 20 }}
        />
    )
}

export default App