import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // for dropdown icon

export default function Screen1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    height: "",
  });

  const handleNext = () => {
    console.log("Form Data:", formData);
    // router.push('/form-step-two'); // Uncomment when ready
  };

  return (
    <ImageBackground
      source={require("../assets/images/background1.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.formBox}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholderTextColor="#bbb"
            />
          </View>

          {/* DOB */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dob}
              onChangeText={(text) => setFormData({ ...formData, dob: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Gender Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                placeholder={{
                  label: "Select gender...",
                  value: null,
                  color: "#bbb",
                }}
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Non-binary", value: "Non-binary" },
                  { label: "Prefer not to say", value: "Prefer not to say" },
                ]}
                style={{
                  inputIOS: styles.dropdownInput,
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.iconContainer,
                }}
                Icon={() => (
                  <Ionicons name="chevron-down" size={20} color="#bbb" />
                )}
                value={formData.gender}
              />
            </View>
          </View>

          {/* Height */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(text) =>
                setFormData({ ...formData, height: text })
              }
              placeholderTextColor="#bbb"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.stepText}>Step 1/2</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screen2")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  formBox: {
    backgroundColor: "rgba(0, 0, 40, 0.5)",
    padding: 20,
    borderRadius: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#a855f7",
    color: "#fff",
    paddingVertical: 6,
  },
  dropdownWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: "#a855f7",
    paddingVertical: 6,
  },
  dropdownInput: {
    color: "#fff",
    paddingRight: 30, // space for icon
  },
  iconContainer: {
    top: 10,
    right: 10,
    position: "absolute",
  },
  stepText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
  button: {
    backgroundColor: "transparent",
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
