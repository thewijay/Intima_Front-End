type FormData = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  gender_other?: string
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
  Dimensions,
  useWindowDimensions,
  ScrollView,
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Get screen dimensions for responsive scaling
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => {
  const baseWidth = 375; // iPhone X width as base
  return (screenWidth / baseWidth) * size;
};

const verticalScale = (size: number) => {
  const baseHeight = 812; // iPhone X height as base
  return (screenHeight / baseHeight) * size;
};

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
  const { width, height } = useWindowDimensions();

  const handleNext = async () => {
    const { firstName, lastName, dob, gender, height, gender_other } = formData

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

    if (gender === 'other' && (!gender_other || gender_other.trim() === '')) {
      alert('Please specify your gender')
      return
    }

    try {
      setLoading(true)
      await SecureStore.setItemAsync('screen1Data', JSON.stringify(formData))
      router.push('/screen2')
    } catch (error) {
      alert('Something went wrong. Please try again.')
      console.error('SecureStore error:', error)
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
              paddingHorizontal: scale(30),
            },
          ]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(60) : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { fontSize: scale(28), marginBottom: verticalScale(30), marginTop: verticalScale(20) }]}>Create Account</Text>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={[styles.formBox, { padding: scale(20), borderRadius: scale(20), marginBottom: verticalScale(23) }]}> 
                <View style={[styles.inputGroup, { marginBottom: verticalScale(20) }]}> 
                  <Text style={[styles.label, { fontSize: scale(14), marginBottom: verticalScale(6) }]}>First Name</Text>
                  <TextInput
                    style={[styles.input, { paddingVertical: verticalScale(6), fontSize: scale(16) }]}
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, firstName: text })
                    }
                    placeholderTextColor="#bbb"
                  />
                </View>

                <View style={[styles.inputGroup, { marginBottom: verticalScale(20) }]}> 
                  <Text style={[styles.label, { fontSize: scale(14), marginBottom: verticalScale(6) }]}>Last Name</Text>
                  <TextInput
                    style={[styles.input, { paddingVertical: verticalScale(6), fontSize: scale(16) }]}
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lastName: text })
                    }
                    placeholderTextColor="#bbb"
                  />
                </View>

                <View style={[styles.inputGroup, { marginBottom: verticalScale(20) }]}> 
                  <Text style={[styles.label, { fontSize: scale(14), marginBottom: verticalScale(6) }]}>Date of Birth</Text>
                  <TextInput
                    style={[styles.input, { paddingVertical: verticalScale(6), fontSize: scale(16) }]}
                    value={formData.dob}
                    onChangeText={(text) =>
                      setFormData({ ...formData, dob: text })
                    }
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#bbb"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { marginBottom: verticalScale(20) }]}> 
                  <Text style={[styles.label, { fontSize: scale(14), marginBottom: verticalScale(6) }]}>Gender</Text>
                  <View style={[styles.dropdownWrapper, { paddingVertical: verticalScale(6) }]}> 
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          gender: value,
                          gender_other:
                            value === 'other' ? formData.gender_other : '',
                        })
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
                        inputIOS: [styles.dropdownInput, { fontSize: scale(16), paddingVertical: verticalScale(8), paddingHorizontal: scale(10), paddingRight: scale(30) }],
                        inputAndroid: [styles.dropdownInput, { fontSize: scale(16), paddingVertical: verticalScale(8), paddingHorizontal: scale(10), paddingRight: scale(30) }],
                        iconContainer: [styles.iconContainer, { top: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(16), right: scale(10) }],
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => (
                        <Ionicons name="chevron-down" size={scale(20)} color="#bbb" />
                      )}
                      value={formData.gender}
                    />
                  </View>

                  {formData.gender === 'other' && (
                    <TextInput
                      style={[styles.input, { paddingVertical: verticalScale(6), fontSize: scale(16) }]}
                      placeholder="Please specify"
                      value={formData.gender_other}
                      onChangeText={(text) =>
                        setFormData({ ...formData, gender_other: text })
                      }
                      placeholderTextColor="#bbb"
                    />
                  )}
                </View>

                <View style={[styles.inputGroup, { marginBottom: verticalScale(20) }]}> 
                  <Text style={[styles.label, { fontSize: scale(14), marginBottom: verticalScale(6) }]}>Height (cm)</Text>
                  <TextInput
                    style={[styles.input, { paddingVertical: verticalScale(6), fontSize: scale(16) }]}
                    value={formData.height}
                    onChangeText={(text) =>
                      setFormData({ ...formData, height: text })
                    }
                    placeholderTextColor="#bbb"
                    keyboardType="numeric"
                  />
                </View>

                <Text style={[styles.stepText, { fontSize: scale(12) }]}>Step 1/2</Text>
              </View>
            </View>

            <View style={{ height: verticalScale(20) }} />

            <TouchableOpacity
              style={[styles.button, {
                paddingVertical: verticalScale(12),
                paddingHorizontal: scale(40),
                borderRadius: scale(30),
                marginTop: verticalScale(10),
                marginBottom: verticalScale(20),
              }]}
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color="#fff" style={{ marginRight: scale(10) }} />
                  <Text style={[styles.buttonText, { fontSize: scale(16) }]}>Please wait...</Text>
                </View>
              ) : (
                <Text style={[styles.buttonText, { fontSize: scale(16) }]}>Next</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: verticalScale(10) }} />
          </ScrollView>
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
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formBox: {
    backgroundColor: 'rgba(0, 0, 40, 0.5)',
  },
  inputGroup: {},
  label: {
    color: '#ccc',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#a855f7',
    color: '#fff',
  },
  dropdownWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: '#a855f7',
  },
  iconContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  dropdownInput: {
    color: '#fff',
  },
  stepText: {
    color: '#ccc',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: '#0ff',
    borderWidth: 1,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
