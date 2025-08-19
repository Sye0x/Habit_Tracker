import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const lightTheme = {
    background: "#f2f8ff",
    containerBackground: "#ffffff",
    text: "#111",
    headingtext: "#abd1a3ff",
    border: "#b7b7b7ff",
    borderFocused: "#ffb888ff",
    placeholder: "#777",
    addButton: "#abd1a3ff",
    addButtonText: "#fff",
    iconColor: "#ffb888ff",
};

const darkTheme = {
    background: "#2b2b2b",
    containerBackground: "#141414",
    text: "#fff",
    headingtext: "#4f5bd5",
    border: "#444",
    borderFocused: "#4f5bd5",
    placeholder: "#888",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    iconColor: "#fff",
};

export default function Login({ navigation }: any) {
    const [thememode, setTheme] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [focused, setFocused] = useState<string | null>(null);

    const theme = thememode ? lightTheme : darkTheme;

    const toggleTheme = () => {
        setTheme(!thememode);
    };

    const handleLogin = () => {
        console.log("Login Data:", { email, password });
    };



    type InputProps = {
        placeholder: string;
        value: string;
        onChangeText: (text: string) => void;
        secureTextEntry?: boolean;
        theme: typeof lightTheme | typeof darkTheme;
        focused: string | null;
        setFocused: (field: string | null) => void;
        fieldName: string;
    };

    const CustomInput: React.FC<InputProps> = ({
        placeholder,
        value,
        onChangeText,
        secureTextEntry = false,
        theme,
        focused,
        setFocused,
        fieldName,
    }) => {
        return (
            <TextInput
                style={[
                    Styles.input,
                    {
                        borderColor: focused === fieldName ? theme.borderFocused : theme.border,
                        color: theme.text,
                        backgroundColor: theme.background,
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setFocused(fieldName)}
                onBlur={() => setFocused(null)}
            />
        );
    };

    return (
        <View style={[Styles.Screen, { backgroundColor: theme.background, alignItems: "center" }]}>
            {/* Theme Toggle */}
            <View style={{ alignItems: "flex-end", margin: hp(3), width: wp(90) }}>
                <TouchableOpacity onPress={toggleTheme}>
                    <FontAwesome name={thememode ? "sun-o" : "moon-o"} size={40} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Login Container */}
            <View style={[Styles.LoginContainer, { backgroundColor: theme.containerBackground }]}>
                <Text style={[Styles.headingText, { color: theme.headingtext }]}>Login</Text>

                {/* Email */}
                <CustomInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="email"
                />

                {/* Password */}
                <CustomInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="password"
                />

                {/* Login Button */}
                <TouchableOpacity style={[Styles.loginButton, { backgroundColor: theme.addButton }]} onPress={handleLogin}>
                    <Text style={[Styles.loginButtonText, { color: theme.addButtonText }]}>Login</Text>
                </TouchableOpacity>

                {/* Don't have an account? */}
                <View style={Styles.signUpRedirectContainer}>
                    <Text style={{ color: theme.text }}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={[Styles.signUpLink, { color: theme.headingtext }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    Screen: {
        flex: 1,
    },
    LoginContainer: {
        width: wp(90),
        height: hp(80),
        borderRadius: 20,
        padding: 20,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headingText: {
        fontSize: 36,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 55,
        borderWidth: 2.5,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
    },
    loginButton: {
        marginTop: 10,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: "600",
    },
    signUpRedirectContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    signUpLink: {
        fontSize: 16,
        fontWeight: "600",
    },
});
