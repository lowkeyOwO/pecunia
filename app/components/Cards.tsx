import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const Card = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name="home" size={32} />
        <Text style={styles.headerTitle}>Title</Text>
      </View>
      <View style={styles.seperator}></View>
      <Text style={styles.cardDescription}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem,
        beatae magnam omnis at, quia minima quae architecto amet officiis ut eum
        nobis dolor tempore fugit doloremque nesciunt ratione, vitae temporibus!
      </Text>
      <View style={styles.seperator}></View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>19/10/2023</Text>
        <View style={styles.optionsContainer}>
            <Image source={require('./gpay.png')}
            resizeMode="contain"
            style={styles.paymentInfo}/>
            <Ionicons name="repeat-outline" size={48}/>
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
    backgroundColor: "gray",
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  cardHeader: {
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },
  headerTitle: {
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
  cardFooter : {
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  cardDate : {
    fontWeight : '300',
    height: '100%',
    padding: 16
},
  optionsContainer : {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection : 'row',
  },
  paymentInfo : {
    height : 48,
    width: 48,
    marginRight: 16
  }
});
