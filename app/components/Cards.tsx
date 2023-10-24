import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const handleDelete = () => {
  alert("DELETING");
};

const getImageComponent = (info: any) => {
  if (info == "gpay") {
    return (
      <Image
        source={require("./gpay.png")}
        resizeMode="contain"
        style={styles.paymentInfo}
      />
    );
  } else if (info == "bank") {
    return (
      <Image
        source={require("./bank.png")}
        resizeMode="contain"
        style={styles.paymentInfo}
      />
    );
  }
  return (
    <Image
      source={require("./cash.png")}
      resizeMode="contain"
      style={styles.paymentInfo}
    />
  );
};

const getCategory = (cat: any) => {
  if (cat == "home") {
    return "home";
  } else if (cat == "food") {
    return "fast-food";
  } else if (cat == "emergency") {
    return "alert-circle";
  } else if (cat == "purchase") {
    return "cart";
  } else if (cat == "travel") {
    return "map";
  } else if (cat == "finance") {
    return "logo-bitcoin";
  } else if (cat == "bills") {
    return "newspaper";
  } else if (cat == "medical") {
    return "bandage";
  } else if (cat == "entertainment") {
    return "beer";
  } else {
    return "help";
  }
};

const Card = ({ props }: any) => {
  const Image = getImageComponent(props.paymentMode);
  const category = getCategory(props.category);
  const stylesList: any = {
    credit: styles.creditText,
    debit: styles.debitText,
    due: styles.dueText,
  };
  const textStyle = stylesList[props.type];
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name={category} size={32} />
        <View style={styles.cardActionButtons}>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={32} color={"red"} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.seperator}></View>
      <Text style={styles.bodyTitle}>{props.title}</Text>
      <Text style={styles.cardDescription}>{props.desc}</Text>
      <View style={styles.seperator}></View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {new Date(
            props.date.seconds * 1000 + props.date.nanoseconds / 1000000
          ).toLocaleDateString()}
        </Text>
        <View style={styles.optionsContainer}>
          {Image}
          <Text style={[styles.headerTitle, textStyle]}>₹{props.amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom : 16
  },
  cardHeader: {
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },
  cardActionButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  headerTitle: {
    fontSize: 32,
  },
  bodyTitle: {
    marginLeft: 16,
    fontSize: 32,
  },
  seperator: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  cardDescription: {
    padding: 16,
  },
  cardFooter: {
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  cardDate: {
    fontWeight: "300",
    height: "100%",
    padding: 16,
  },
  optionsContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    flex: 1,
    flexDirection: "row",
  },
  paymentInfo: {
    height: 48,
    width: 48,
    marginRight: 16,
  },
  creditText: { color: "green" },
  dueText: { color: "yellow" },
  debitText: { color: "red" },
});
