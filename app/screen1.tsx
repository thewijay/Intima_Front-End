type FormData = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  height: string
}
import React, { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { Ionicons } from '@expo/vector-icons'

export default function Screen1Data() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    height: '',
  })

  const handleNext = async () => {
    const { firstName, lastName, dob, gender, height } = formData

    if (!firstName || !lastName || !dob || gender === '') {
      alert('Please fill in all required fields')
      return
    }

    const heightValue = parseFloat(height)
    if (
      !height ||
      isNaN(heightValue) ||
      heightValue <= 0 ||
      heightValue > 300
    ) {
      alert('Please enter a realistic height in cm')
      return
    }

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dob)
    if (!isValidDate) {
      alert('Date of Birth must be in YYYY-MM-DD format')
      return
    }

    try {
      setLoading(true) // Start loading
      await SecureStore.setItemAsync('screen1Data', JSON.stringify(formData))
      router.push('/screen2') // Navigate on success
    } catch (error) {
      alert('Something went wrong. Please try again.')
      console.error('SecureStore error:', error)
    } finally {
      setLoading(false) // Stop loading
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

          {/* Main content area with flex: 1 */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, dob: text })
                  }
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
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
                      label: 'Select gender...',
                      value: null,
                      color: '#bbb',
                    }}
                    items={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Transgender Male', value: 'trans_male' },
                      { label: 'Transgender Female', value: 'trans_female' },
                      {
                        label: 'Non-Binary / Non-Conforming',
                        value: 'non_binary',
                      },
                      { label: 'Other', value: 'other' },
                    ]}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => (
                      <Ionicons name="chevron-down" size={20} color="#bbb" />
                    )}
                    value={formData.gender}
                  />
                  {formData.gender === 'other' && (
                    <TextInput
                      style={styles.input}
                      placeholder="Please specify"
                      value={formData.gender_other}
                      onChangeText={(text) =>
                        setFormData({ ...formData, gender_other: text })
                      }
                      placeholderTextColor="#bbb"
                    />
                  )}
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
              <Text style={styles.stepText}>Step 1/2</Text>
            </View>
          </View>

          {/* Button at the bottom */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Please wait...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Next</Text>
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
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  formBox: {
    backgroundColor: 'rgba(0, 0, 40, 0.5)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 23,
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
  iconContainer: {
    top: Platform.OS === 'ios' ? 12 : 16,
    right: 10,
    position: 'absolute',
    pointerEvents: 'none',
  },
  dropdownInput: {
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingRight: 30, // Ensures space for the icon
    fontSize: 16,
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
    marginBottom: 20, // Add space from bottom edge
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
