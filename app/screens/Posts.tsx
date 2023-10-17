import { getAuth } from "firebase/auth";
import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import { useState } from "react";
import Card from "../components/Cards";

interface Posts {
    
}

const PostsScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user?.email?.split("@")[0];
  const [posts, setPosts] = useState<Posts | null>(null);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postsContainer}>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostsScreen;

const startHeight = 15 + (StatusBar.currentHeight || 0);

const styles = StyleSheet.create({
  container: {
    paddingTop: startHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    color: "blue",
  },
  postsContainer: {
    width : '100%',
    paddingHorizontal: 8,
    gap: 16
  },
  scrollView: {
  },
  text: {
    fontSize: 24,
    marginBottom : 24
  },
});
