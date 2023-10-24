import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { ContributionGraph, ProgressChart } from "react-native-chart-kit";
import { useState, useEffect } from "react";
import { FIREBASE_STORE } from "../../FirebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const getDateMap = (posts: any[]) => {
  const dateMap: any[] = [];
  posts.forEach((post: any) => {
    const newDate = new Date(
      post.date.seconds * 1000 + post.date.nanoseconds / 1000000
    );
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const date = new Date(year + "-" + month + "-" + day);
    dateMap.push({ date: date, count: 1 });
  });
  return dateMap;
};

const getLastDate = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 2;
  const day = newDate.getDate();
  const date = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  return date;
};

const getExpenseType = (postsArray: any[]) => {
  const data = {
    labels: ["debit", "credit", "due"],
    data: [0, 0, 0],
  };
  postsArray.forEach((post) => {
    switch (post.type) {
      case "debit":
        data.data[0] += 1/10;
        break;
      case "credit":
        data.data[1] += 1/10;
        break;
      case "due":
        data.data[2] += 1/10;
        break;
      default:
        break;
    }
  });
  
  return data;
};

const AnalyticsScreen = () => {
  const handleToolTip: any = {};

  const db = collection(FIREBASE_STORE, "users");
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user?.email?.split("@")[0];
  const docRef = doc(db, username);
  const dateDetails =
    new Date().toLocaleString("default", { month: "long" }) +
    "-" +
    new Date().getFullYear().toString();
  const [postsData, setPostsData] = useState<any[]>([]);
  const [isEmpty, setEmpty] = useState<boolean>(false);
  const [isGenerated, setGenerated] = useState<boolean>(false);
  const [dateMap, setDateMap] = useState<{ date: string; count: number }[]>([]);
  const [progressData, setProgressData] = useState<{
    labels: string[];
    data: number[];
  }>({ labels: ["credit", "debit", "due"], data: [0, 0, 0] });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const postsArray = Object.values(data[dateDetails]);
          if (postsArray.length === 0) {
            setEmpty(true);
          } else {
            const generatedDateMap = getDateMap(postsArray);
            setDateMap(generatedDateMap);
            const generatedProgress = getExpenseType(postsArray);
            setProgressData(generatedProgress);
            setGenerated(true);
          }
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.analyticsContainer}>
      <ScrollView style={styles.scrollView}>
        {isEmpty ? (
          <Text>ADD SOME DATA</Text>
        ) : (
          <>
            <View style={styles.contributionContainer}>
              {isGenerated ? (
                <>
                  <ContributionGraph
                    values={dateMap}
                    endDate={new Date(getLastDate())}
                    numDays={105}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                    tooltipDataAttrs={(value) => handleToolTip}
                  />
                  <ProgressChart
                    data={progressData}
                    width={Dimensions.get("window").width}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                  />
                </>
              ) : (
                <Text>Loading</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  analyticsContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    gap: 16,
    height: "100%",
  },
  contributionContainer: {
    flex: 1,
    marginTop: 48,
  },
  progressContainer: {
    flex: 1,
    marginTop: 48,
  },
});
