import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const messages = [
  {
    id: "1",
    text: "Hello! How can I help you today?",
    sender: "bot",
    time: "10:41 AM",
  },
  {
    id: "2",
    text: "I need some information.",
    sender: "user",
    time: "10:42 AM",
  },
  { id: "3", text: "Sure! Ask me anything.", sender: "bot", time: "10:43 AM" },
  { id: "4", text: "Thank you!", sender: "user", time: "10:44 AM" },
];

export default function ChatScreen() {
  const renderItem = ({ item }: { item: any }) => {
    return item.sender === "bot" ? (
      <View style={styles.botRow}>
        <Image
          source={require("../assets/images/logo_only.png")}
          style={styles.logoSmall}
        />
        <View>
          <View style={[styles.messageBubble, styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    ) : (
      <View style={styles.userRow}>
        <View style={[styles.messageBubble, styles.userBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <Text style={[styles.timeText, { alignSelf: "flex-end" }]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/background1.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Left Logo */}
        <View style={styles.logoTopLeftContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoTopLeft}
            resizeMode="contain"
          />
        </View>

        {/* Chat Messages */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chat}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Ionicons name="happy-outline" size={24} color="#fff" />
          <TextInput
            placeholder="Type message here..."
            placeholderTextColor="#ccc"
            style={styles.input}
          />
          <TouchableOpacity>
            <Ionicons name="send" size={24} color="#00E1FF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
logoTopLeftContainer: {
  alignItems: "flex-start",
},
logoTopLeft: {
  width: width * 0.35,   
  height: width * 0.35,
},
  chat: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    marginBottom: 0,
  },
  botRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
  },
  userRow: {
    alignSelf: "flex-end",
    marginVertical: 8,
    maxWidth: "80%",
  },
  logoSmall: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginTop: 8,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 4,
    maxWidth: width * 0.75,
  },
  botBubble: {
    backgroundColor: "#1BD6F2",
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: "#B486F4",
    borderTopRightRadius: 0,
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  timeText: {
    fontSize: 10,
    color: "#ccc",
    marginLeft: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#141F39",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
  },
});