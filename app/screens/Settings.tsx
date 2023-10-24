import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const handleSignOut = async () => {
  signOut(FIREBASE_AUTH);
};

const SettingsScreen = () => {
  return (
    <View style={styles.settingsContainer}>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
        <Text style={styles.signOutTxt}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutBtn: {
    backgroundColor: "blue",
    padding: 24,
    width: "60%",
    height: '10%',
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutTxt : {
    color : 'white',
    fontSize : 20
  }
});
