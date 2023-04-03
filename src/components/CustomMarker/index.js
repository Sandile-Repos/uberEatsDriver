import { View } from "react-native";
import React from "react";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";

const CustomMarker = ({ data, type }) => {
  return (
    <Marker
      coordinate={{
        latitude: data.lat,
        longitude: data.lng,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
      }}
      title={data.name}
      description={data.address}
    >
      <View
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 15,
        }}
      >
        {type === "RESTAURANT" ? (
          <Entypo name="shop" size={30} color="white" />
        ) : (
          <MaterialIcons name="restaurant" size={30} color="white" />
        )}
      </View>
    </Marker>
  );
};

export default CustomMarker;
