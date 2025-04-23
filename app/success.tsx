// app/success.tsx (or wherever your screens live)
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  console.log('Params received on Success screen:', params);
  const { email } = useLocalSearchParams(); // get email from navigation params
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login'); // or whatever your login screen path is
  };

  return (
        <ImageBackground
          source={require('../assets/images/background1.png')}
          style={styles.background}
          resizeMode="cover"
        >

    <View style={styles.container}>
      <Text style={styles.text1}>Hii!</Text>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.text}>login successful!</Text>
      <Text style={styles.text}>🎉</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogout}
              >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
    </View>
        </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text1: {
      fontSize: 35,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  background: {
    flex: 1,
  },
  button: {
    backgroundColor: '#00ACC1', // Cyan shade
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
