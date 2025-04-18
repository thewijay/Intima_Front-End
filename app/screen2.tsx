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

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Weight: "",
    Marital_Status: "",
    Sexual_Activity_Level: "",
    Menstrual_Cycle_Details: "",
    Medical_Conditions: "",
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
          {/* Weight */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.Weight}
              onChangeText={(text) =>
                setFormData({ ...formData, Weight: text })
              }
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Marital Status Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marital Status</Text>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={(value) =>
                  setFormData({ ...formData, Marital_Status: value })
                }
                placeholder={{
                  label: "Select marital status...",
                  value: null,
                  color: "#bbb",
                }}
                items={[
                  { label: "Single", value: "Single" },
                  { label: "Married", value: "Married" },
                  { label: "Divorced", value: "Divorced" },
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
                value={formData.Marital_Status}
              />
            </View>
          </View>

          {/* Sexual Activity Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sexual Activity Level</Text>
            <TextInput
              style={styles.input}
              value={formData.Sexual_Activity_Level}
              onChangeText={(text) =>
                setFormData({ ...formData, Sexual_Activity_Level: text })
              }
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Menstrual Cycle Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Menstrual Cycle Details</Text>
            <TextInput
              style={styles.input}
              value={formData.Menstrual_Cycle_Details}
              onChangeText={(text) =>
                setFormData({ ...formData, Menstrual_Cycle_Details: text })
              }
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Medical Conditions */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical Conditions</Text>
            <TextInput
              style={styles.input}
              value={formData.Medical_Conditions}
              onChangeText={(text) =>
                setFormData({ ...formData, Medical_Conditions: text })
              }
              placeholderTextColor="#bbb"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.stepText}>Step 2/2</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screen2")}
        >
          <Text style={styles.buttonText}>
            You’re all set! Let’s get started
          </Text>
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
