import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { toggletheme } from "./redux/action";
import type { RootState } from "./redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function SignUp({ navigation }: any) {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [focused, setFocused] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    // Add two new states at the top
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);


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
        if (!username) newErrors.username = "Username is required";
        if (!email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const handleSignUp = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setEmail("");
                setErrors({});
                Alert.alert("Sign Up Successfully");
                navigation.navigate("LogIn");
            })
            .catch((err) => {
                setErrors({ general: err.message });
            });
    };

    return (
        <View style={[Styles.Screen, { backgroundColor: theme.background, alignItems: "center" }]}>
            {/* Theme Toggle */}
            <View style={{ alignItems: "flex-end", margin: hp(3), width: wp(90) }}>
                <TouchableOpacity onPress={toggleTheme}>
                    <FontAwesome name={darkMode ? "moon-o" : "sun-o"} size={40} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Sign Up Container */}
            <View style={[Styles.SignUpContainer, { backgroundColor: theme.containerBackground }]}>
                <Text style={[Styles.headingText, { color: theme.headingtext }]}>Sign Up</Text>

                {/* General Error */}
                {errors.general && (
                    <Text style={[Styles.errorText, { textAlign: "center", marginBottom: 15 }]}>
                        {errors.general}
                    </Text>
                )}

                {/* Username */}
                <View style={Styles.inputWrapper}>
                    <FontAwesome name="user" size={22} color={theme.iconColor} style={Styles.inputIcon} />
                    <TextInput
                        style={[
                            Styles.input,
                            {
                                borderColor: errors.username
                                    ? theme.error
                                    : focused === "username"
                                        ? theme.borderFocused
                                        : theme.border,
                                color: theme.text,
                                backgroundColor: theme.background,
                            },
                        ]}
                        placeholder="Username"
                        placeholderTextColor={theme.placeholder}
                        value={username}
                        onChangeText={setUsername}
                        onFocus={() => setFocused("username")}
                        onBlur={() => setFocused(null)}
                    />
                </View>
                {errors.username && <Text style={Styles.errorText}>{errors.username}</Text>}

                {/* Email */}
                <View style={Styles.inputWrapper}>
                    <FontAwesome name="envelope" size={20} color={theme.iconColor} style={Styles.inputIcon} />
                    <TextInput
                        style={[
                            Styles.input,
                            {
                                borderColor: errors.email
                                    ? theme.error
                                    : focused === "email"
                                        ? theme.borderFocused
                                        : theme.border,
                                color: theme.text,
                                backgroundColor: theme.background,
                            },
                        ]}
                        placeholder="Email"
                        placeholderTextColor={theme.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                    />
                </View>
                {errors.email && <Text style={Styles.errorText}>{errors.email}</Text>}

                {/* Password */}
                {/* Password */}
                <View style={Styles.inputWrapper}>
                    <FontAwesome name="lock" size={24} color={theme.iconColor} style={Styles.inputIcon} />
                    <TextInput
                        style={[
                            Styles.input,
                            {
                                borderColor: errors.password
                                    ? theme.error
                                    : focused === "password"
                                        ? theme.borderFocused
                                        : theme.border,
                                color: theme.text,
                                backgroundColor: theme.background,
                            },
                        ]}
                        placeholder="Password"
                        placeholderTextColor={theme.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                        style={Styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesome
                            name={showPassword ? "eye" : "eye-slash"}
                            size={20}
                            color={theme.iconColor}
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={Styles.errorText}>{errors.password}</Text>}

                {/* Confirm Password */}
                <View style={Styles.inputWrapper}>
                    <FontAwesome name="lock" size={24} color={theme.iconColor} style={Styles.inputIcon} />
                    <TextInput
                        style={[
                            Styles.input,
                            {
                                borderColor: errors.confirmPassword
                                    ? theme.error
                                    : focused === "confirmPassword"
                                        ? theme.borderFocused
                                        : theme.border,
                                color: theme.text,
                                backgroundColor: theme.background,
                            },
                        ]}
                        placeholder="Confirm Password"
                        placeholderTextColor={theme.placeholder}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        onFocus={() => setFocused("confirmPassword")}
                        onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                        style={Styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <FontAwesome
                            name={showConfirmPassword ? "eye" : "eye-slash"}
                            size={20}
                            color={theme.iconColor}
                        />
                    </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={Styles.errorText}>{errors.confirmPassword}</Text>}

                {/* Sign Up Button */}
                <TouchableOpacity style={[Styles.signUpButton, { backgroundColor: theme.addButton }]} onPress={handleSignUp}>
                    <Text style={[Styles.signUpButtonText, { color: theme.addButtonText }]}>Sign Up</Text>
                </TouchableOpacity>

                {/* Already have an account? */}
                <View style={Styles.loginRedirectContainer}>
                    <Text style={{ color: theme.text }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
                        <Text style={[Styles.loginLink, { color: theme.headingtext }]}>Login</Text>
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
    SignUpContainer: {
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
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    inputIcon: {
        position: "absolute",
        left: 15,
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: 55,
        borderWidth: 2.5,
        borderRadius: 12,
        paddingHorizontal: 45, // leave space for icon
        fontSize: 18,
    },
    signUpButton: {
        marginTop: 10,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    signUpButtonText: {
        fontSize: 20,
        fontWeight: "600",
    },
    loginRedirectContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginLink: {
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#ff4d4d",
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        padding: 5,
    },
});
