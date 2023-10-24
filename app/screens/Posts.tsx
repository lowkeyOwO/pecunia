import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SelectList } from "react-native-dropdown-select-list";
import { FIREBASE_STORE } from "../../FirebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { randomUUID } from "expo-crypto";
import Card from "../components/Cards";

export interface ExpenseItem {
  uid: string;
  category:
    | "home"
    | "food"
    | "emergency"
    | "purchase"
    | "travel"
    | "finance"
    | "bills"
    | "medical"
    | 'entertainment'
    | "other";
  amount: number;
  title: string;
  desc: string;
  date: Date;
  paymentMode: "cash" | "gpay" | "bank";
  type: "credit" | "debit" | "due";
}

export type Posts = {
  [key: string]: ExpenseItem[];
};

type Categories =
  | "home"
  | "food"
  | "emergency"
  | "purchase"
  | "travel"
  | "finance"
  | "bills"
  | "medical"
  | 'entertainment'
  | "other";

type Modes = "cash" | "gpay" | "bank";

type Types = "credit" | "debit" | "due";

const checkValidity = (formData: ExpenseItem) => {
  if (
    formData.amount > 0 &&
    formData.title.length > 0 &&
    formData.desc.length > 0 &&
    formData.date != undefined
  )
    return true;
  return false;
};
const PostsScreen = () => {
  const [formData, setFormData] = useState<ExpenseItem | null>(null);
  const [addPostVisible, toggleAddPostVisible] = useState<boolean>(false);
  const [selectCategory, setSelectedCategory] = useState<Categories>("home");
  const [selectMode, setSelectedMode] = useState<Modes>("cash");
  const [selectType, setSelectedType] = useState<Types>("debit");
  const [updated,updateUI] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const db = collection(FIREBASE_STORE, "users");
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user?.email?.split("@")[0];
  const docRef = doc(db, username);
  const dateDetails =
    new Date().toLocaleString("default", { month: "long" }) +
    "-" +
    new Date().getFullYear().toString();
  const [postsData, setPostsData] = useState<any[]>([<Text>Hello</Text>]);

  useEffect(() => {
    const fetchData = async () => {
      updateUI(false);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const postsArray = Object.values(data[dateDetails]);
          if (postsArray.length === 0) {
            setPostsData([
              <Text key="no-posts">Add some posts to view data!</Text>,
            ]);
          } else {
            const modifyPosts = postsArray.map((post: any, index) => (
              <Card key={post.uid} props={post} />
            ));
            setPostsData(modifyPosts);
          }
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchData();
  }, [updated]);
  const updateData = (fieldToUpdate: string, value: any) => {
    if (fieldToUpdate == "date") {
      value = new Date(value);
    }
    if (fieldToUpdate == "amount") {
      value = +value;
    }
    if (formData) {
      setFormData({
        ...formData,
        [fieldToUpdate]: value,
      });
    } else {
      const tempData: ExpenseItem = {
        uid: randomUUID(),
        category: "home",
        amount: 0,
        title: "",
        desc: "",
        date: new Date(),
        paymentMode: "cash",
        type: "credit",
        [fieldToUpdate]: value,
      };

      setFormData(tempData);
    }
  };

  const categoryData = [
    { key: "1", value: "home" },
    { key: "2", value: "food" },
    { key: "3", value: "emergency" },
    { key: "4", value: "purchase" },
    { key: "5", value: "finance" },
    { key: "6", value: "travel" },
    { key: "7", value: "bills" },
    { key: "8", value: "medical" },
  ];
  const typeData = [
    { key: "1", value: "credit" },
    { key: "2", value: "debit" },
    { key: "3", value: "due" },
  ];
  const modeData = [
    { key: "1", value: "gpay" },
    { key: "2", value: "cash" },
    { key: "3", value: "bank" },
  ];

  const addData = async () => {
    if (formData) {
      formData.paymentMode = selectMode;
      formData.category = selectCategory;
      formData.type = selectType;
      const valid = checkValidity(formData);
      const dateId =
        formData.date.toLocaleString("default", { month: "long" }) +
        "-" +
        formData.date.getFullYear().toString();
      if (valid) {
        const data = await setDoc(
          docRef,
          {
            [dateId]: arrayUnion(formData),
          },
          { merge: true }
        );
        updateUI(true);
        setFormData(null);
      } else {
        alert("Some data missing, please try again!");
      }
    } else {
      alert("Cannot Submit empty form!");
    }
  };

  const onChange = (event: any, selectedDate: any) => {
    setDate(selectedDate);
    setShowDate(!showDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        visible={addPostVisible}
        transparent={true}
        onRequestClose={() => {
          toggleAddPostVisible(!addPostVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Cashflow</Text>
          <ScrollView style={styles.formScrollView}>
            <View style={styles.formContainer}>
              <TextInput
                value={formData?.title}
                style={styles.input}
                placeholder="Title"
                autoCapitalize="none"
                onChangeText={(text) => updateData("title", text)}
              />
              <TextInput
                value={formData?.desc}
                style={[styles.input, styles.description]}
                placeholder="Description"
                autoCapitalize="none"
                onChangeText={(text) => updateData("desc", text)}
              />
              <TextInput
                value={formData?.amount.toString()}
                style={[styles.input]}
                placeholder="Amount"
                autoCapitalize="none"
                onChangeText={(text) => updateData("amount", text)}
              />
              {showDate && (
                <DateTimePicker
                  value={date}
                  mode={"date"}
                  onChange={onChange}
                />
              )}
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDate(!showDate)}
              >
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <View style={styles.listView}>
                <SelectList
                  setSelected={(val: Categories) => {
                    setSelectedCategory(val);
                  }}
                  data={categoryData}
                  save="value"
                />
              </View>
              <View style={styles.listView}>
                <SelectList
                  setSelected={(val: Modes) => {
                    setSelectedMode(val);
                  }}
                  data={modeData}
                  save="value"
                />
              </View>
              <View style={styles.listView}>
                <SelectList
                  setSelected={(val: Types) => {
                    setSelectedType(val);
                  }}
                  data={typeData}
                  save="value"
                />
              </View>
              <TouchableOpacity style={styles.saveDataBtn} onPress={addData}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeExpenseModal}
            onPress={() => toggleAddPostVisible(!addPostVisible)}
          >
            <Ionicons name="close-sharp" size={48} color={"red"} />
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postsContainer}>
          {postsData}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addExpenseIcon}
        onPress={() => toggleAddPostVisible(!addPostVisible)}
      >
        <Ionicons name="add-circle-sharp" size={72} color={"green"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PostsScreen;

const startHeight = 15 + (StatusBar.currentHeight || 0);

const styles = StyleSheet.create({
  container: {
    paddingTop: startHeight,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : 'black'
  },
  modalContainer: {
    paddingTop: startHeight,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 2,
    height: "40%",
    width: "90%",
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 64,
  },
  dateBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 28,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 24,
  },
  postsContainer: {
    width: "100%",
    gap: 16,
    flex: 1,
  },
  formContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 72,
  },
  scrollView: {
    flex: 1,
    width: "95%",
    gap: 16,
    height: "100%",
  },
  formScrollView: {
    flex: 1,
    width: "100%",
    gap: 16,
    height: "100%",
  },
  text: {
    fontSize: 24,
    marginBottom: 24,
    color: "white",
  },
  addExpenseIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },
  modalTitle: {
    color: "lime",
    fontSize: 24,
    position: "absolute",
    top: 0,
    left: 0,
    padding: 24,
  },
  closeExpenseModal: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 16,
  },
  input: {
    width: "80%",
    fontSize: 16,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
    marginVertical: 8,
  },
  description: {
    height: "15%",
  },
  listView: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 8,
  },
  saveDataBtn: {
    backgroundColor: "green",
    width: "80%",
    height: "8%",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "white",
    fontSize: 24,
  },
});
