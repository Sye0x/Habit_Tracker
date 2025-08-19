import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toggletheme } from "./redux/action";
import type { RootState } from "./redux/rootReducer";
import auth from "@react-native-firebase/auth";

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
    error: "#ff4d4d",
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
    error: "#ff4d4d",
};

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme);
    const theme = darkMode ? darkTheme : lightTheme;

    const toggleTheme = async () => {
        const newMode = !darkMode;
        dispatch(toggletheme(newMode));
        await AsyncStorage.setItem("colorMode", JSON.stringify(newMode));
    };

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("colorMode");
            if (savedTheme !== null) {
                const parsed = JSON.parse(savedTheme);
                if (parsed !== darkMode) {
                    dispatch(toggletheme(parsed));
                }
            }
        })();
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        return newErrors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({}); // clear before Firebase call
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("Login successful");
                setEmail("");
                setPassword("");
            })
            .catch((error) => {
                let message = "Wrong email or password";

                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    message = "Wrong email or password";
                } else if (error.code === "auth/invalid-email") {
                    message = "Invalid email format";
                } else if (error.code === "auth/too-many-requests") {
                    message = "Too many failed attempts. Try again later.";
                }

                setErrors({ general: message });
            });
    };


    return (
        <View style={[styles.Screen, { backgroundColor: theme.background, alignItems: "center" }]}>
            {/* Theme Toggle */}
            <View style={{ alignItems: "flex-end", margin: hp(3), width: wp(90) }}>
                <TouchableOpacity onPress={toggleTheme}>
                    <FontAwesome name={darkMode ? "moon-o" : "sun-o"} size={40} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Login Container */}
            <View style={[styles.LoginContainer, { backgroundColor: theme.containerBackground }]}>
                <Text style={[styles.headingText, { color: theme.headingtext }]}>Login</Text>

                {/* General Error */}
                {errors.general && (
                    <Text style={[styles.errorText, { textAlign: "center", marginBottom: 10 }]}>
                        {errors.general}
                    </Text>
                )}

                {/* Email with Icon */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: errors.email
                                ? theme.error
                                : focused === "email"
                                    ? theme.borderFocused
                                    : theme.border,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <FontAwesome name="envelope" size={22} color={theme.iconColor} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Email"
                        placeholderTextColor={theme.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                {/* Password with Icon + Eye toggle */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: errors.password
                                ? theme.error
                                : focused === "password"
                                    ? theme.borderFocused
                                    : theme.border,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <FontAwesome name="lock" size={24} color={theme.iconColor} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Password"
                        placeholderTextColor={theme.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <FontAwesome
                            name={showPassword ? "eye-slash" : "eye"}
                            size={22}
                            color={theme.iconColor}
                            style={styles.iconRight}
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                {/* Login Button */}
                <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.addButton }]} onPress={handleLogin}>
                    <Text style={[styles.loginButtonText, { color: theme.addButtonText }]}>Login</Text>
                </TouchableOpacity>

                {/* Don’t have an account? */}
                <View style={styles.signUpRedirectContainer}>
                    <Text style={{ color: theme.text }}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={[styles.signUpLink, { color: theme.headingtext }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Screen: { flex: 1 },
    LoginContainer: {
        width: wp(90),
        height: hp(70),
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 55,
    },
    icon: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 18,
    },
    loginButton: {
        marginTop: 20,
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
    errorText: {
        color: "#ff4d4d",
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
});
