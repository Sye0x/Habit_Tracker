import { StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

function GetStarted({ navigation }: any) {

    return (
        <ImageBackground source={require("../assets/images/WelcomeMessage2.png")} style={styles.container}>
            <TouchableOpacity style={styles.GetStartedButton} activeOpacity={0.6}
                onPress={() => navigation.navigate("UserDetailsForm")}>
                <Text style={styles.ButtonText}>Get Started</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "25%"
    },
    GetStartedButton: {
        backgroundColor: "#bee1faff",
        width: "60%",
        height: "10%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        elevation: 20
    },
    ButtonText: {
        color: "#fcb7b7ff",
        fontSize: 24,
        fontWeight: "bold"
    }

});

export default GetStarted;