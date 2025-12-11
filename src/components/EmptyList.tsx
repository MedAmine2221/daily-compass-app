import React from "react";
import { Text, View } from "react-native";
import { EmptyComponentData } from "../constants/interfaces";

export default function EmptyComponent(data: EmptyComponentData) {
  return (
    <View className="bg-white rounded-xl p-10 items-center shadow-sm">
      <Text className="text-5xl mb-3">{data.emoji}</Text>
      <Text className="text-center text-base font-semibold text-gray-600 mb-1">
        {data.title}
      </Text>
      <Text className="text-sm text-gray-400 text-center">
        {data.desc}
      </Text>
    </View>
  );
}
