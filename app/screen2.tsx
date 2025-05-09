import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Ionicons } from '@expo/vector-icons' // for dropdown icon
import { updateUserProfile } from '../hooks/api/auth'
import Screen1Data from './screen1'

type Screen1Data = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  height: string
  gender_other?: string
}

export default function Screen2() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    Weight: '',
    Marital_Status: '',
    Sexual_Activity_Level: '',
    Menstrual_Cycle_Details: '',
    Medical_Conditions: '',
  })

  const [screen1Data, setScreen1Data] = useState<Screen1Data | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await SecureStore.getItemAsync('screen1Data')
      if (savedData) {
        setScreen1Data(JSON.parse(savedData) as Screen1Data)
      } else {
        alert(
          'Missing data from previous step. Please go back and fill it again.'
        )
        router.push('/screen1')
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    const accessToken = await SecureStore.getItemAsync('token')
    const savedToken = await SecureStore.getItemAsync('token')
    console.log('Token saved:', savedToken)

    if (!accessToken) {
      alert('User is not authenticated. Please log in again.')
      return
    }

    if (!screen1Data) {
      alert('Missing profile data from previous screen.')
      return
    }

    // Form validation
    const { Weight, Marital_Status, Sexual_Activity_Level } = formData
    const weightValue = parseFloat(Weight)

    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 300) {
      alert('Please enter a valid weight between 1 and 300 kg.')
      return
    }

    if (!Marital_Status || !Sexual_Activity_Level) {
      alert('Please fill all required fields.')
      return
    }

    // Map Marital_Status to backend value
    const maritalStatusMap = {
      Single: 'single',
      Married: 'married',
      Divorced: 'divorced',
      'Prefer not to say': '', // or handle as needed
    }

    setLoading(true)

    try {
      const fullProfile = {
        first_name: screen1Data.firstName,
        last_name: screen1Data.lastName,
        date_of_birth: screen1Data.dob,
        gender: screen1Data.gender,
        gender_other: screen1Data.gender_other || '',
        height_cm: parseFloat(screen1Data.height),
        weight_kg: weightValue,
        marital_status:
          maritalStatusMap[Marital_Status as keyof typeof maritalStatusMap] || '',
        sexually_active: Sexual_Activity_Level,
        menstrual_cycle: formData.Menstrual_Cycle_Details,
        medical_conditions: formData.Medical_Conditions,
      }

      const response = await updateUserProfile(accessToken, fullProfile)
      console.log('Full profile saved:', response)

      await SecureStore.deleteItemAsync('screen1Data')
      router.push('/success')
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Profile update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/background1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.container,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
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
                keyboardType="numeric"
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
                    label: 'Select marital status...',
                    value: null,
                    color: '#bbb',
                  }}
                  items={[
                    { label: 'Single', value: 'Single' },
                    { label: 'Married', value: 'Married' },
                    { label: 'Divorced', value: 'Divorced' },
                    { label: 'Prefer not to say', value: 'Prefer not to say' },
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

            {/* Sexual Activity Level Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexual Activity Level</Text>
              <View style={styles.dropdownWrapper}>
                <RNPickerSelect
                  onValueChange={(value) =>
                    setFormData({ ...formData, Sexual_Activity_Level: value })
                  }
                  placeholder={{
                    label: 'Select sexual activity level...',
                    value: null,
                    color: '#bbb',
                  }}
                  items={[
                    { label: 'Low', value: 'Low' },
                    { label: 'Moderate', value: 'Moderate' },
                    { label: 'High', value: 'High' },
                    { label: 'Prefer not to say', value: 'Prefer not to say' },
                  ]}
                  style={{
                    inputIOS: styles.dropdownInput,
                    inputAndroid: styles.dropdownInput,
                    iconContainer: styles.iconContainer,
                  }}
                  Icon={() => (
                    <Ionicons name="chevron-down" size={20} color="#bbb" />
                  )}
                  value={formData.Sexual_Activity_Level}
                />
              </View>
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
              />
            </View>

            <Text style={styles.stepText}>Step 2/2</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                You’re all set! Let’s get started
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  formBox: {
    backgroundColor: 'rgba(0, 0, 40, 0.5)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#a855f7',
    color: '#fff',
    paddingVertical: 6,
  },
  dropdownWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: '#a855f7',
    paddingVertical: 6,
  },
  dropdownInput: {
    color: '#fff',
    paddingRight: 30, // space for icon
  },
  iconContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
  },
  stepText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 0,
    fontSize: 12,
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: '#0ff',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
