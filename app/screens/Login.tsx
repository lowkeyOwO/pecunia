import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_STORE } from "../../FirebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, isLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    isLoading(true);
    try {
      const status = await signInWithEmailAndPassword(auth, email, password);
      console.log(status);
    } catch (err: any) {
      alert("Sign in failed:\t" + err.message);
    } finally {
      isLoading(false);
    }
  };

  const signUp = async () => {
    isLoading(true);
    try {
      const status = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(status.user.email);
      const db = collection(FIREBASE_STORE, "users");
      const username = status.user.email?.split("@")[0] || "user";
      console.log(username);
      const data = await setDoc(doc(db, username), {});
      console.log("DATA:\t", data);
    } catch (err: any) {
      alert("Sign Up failed:\t" + err.message);
    } finally {
      isLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../screens/image.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Image
          source={require("../screens/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          value={password}
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity
              onPress={signIn}
              style={[styles.input, styles.login]}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signUp} style={styles.signUp}>
              <Text style={styles.signUpText}>New Here? Signup!</Text>
            </TouchableOpacity>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    height: "15%",
    alignSelf: "center",
  },
  input: {
    width: "80%",
    fontSize: 16,
    borderRadius: 4,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    alignSelf: "center",
    marginBottom: 12,
  },
  login: {
    width: "40%",
    padding: 12,
    alignItems: "center",
    borderColor: "green",
    backgroundColor: "green",
  },
  buttonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  signUp: {
    fontSize: 16,
    borderRadius: 4,
    alignSelf: "center",
  },
  signUpText: {
    color: "blue",
  },
});

export default Login;
