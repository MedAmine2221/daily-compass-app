import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { PRIMARY_COLOR } from "../constants/colors";
import { AppDropdownPropsInterface } from "../constants/interfaces";

export default function AppDropdown({
  control,
  errors,
  name,
  label,
  data,
  icon = "flag",
  onChange: externalOnChange,
  valeur
}:AppDropdownPropsInterface) {
  const [focused, setFocused] = useState(false);

  return control && name && errors ? (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange: fieldOnChange, value } }) => (
        <View className="w-full">
          <Text className="mb-1 text-gray-700 font-semibold">{label}</Text>

          <View
            className={`
              flex-row items-center 
              rounded-[15px]
              ${focused ? "border-[1.25px]" : "border-[0.5px]"}
              ${focused ? "border-[#4e4db0]" : errors?.[name] ? "border-red-400" : "border-black"}
              bg-white
              px-3
            `}
          >
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={focused ? PRIMARY_COLOR : errors[name] ? "#f87171" : "#777"}
            />

            <Dropdown
              style={{ flex: 1, height: 50 }}
              selectedTextStyle={{ color: "black", fontSize: 15 }}
              placeholderStyle={{ color: "#777", fontSize: 14 }}
              data={data}
              labelField="label"
              valueField="value"
              value={value}
              placeholder="Select"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(item) => {
                fieldOnChange(item.value);
                externalOnChange && externalOnChange(item.value);
                setFocused(false);
              }}
            />
          </View>
          {errors?.[name] && (
            <Text className="mt-1 text-red-400 font-bold text-center">
              {String(errors[name]?.message)}
            </Text>
          )}
        </View>
      )}
    />
  ) : (
    <View className="w-full">
      <Text className="mb-1 text-gray-700 font-semibold">{label}</Text>

      <View
        className={`
          flex-row items-center 
          rounded-[15px]
          ${focused ? "border-[1.25px]" : "border-[0.5px]"}
          ${focused ? "border-[#4e4db0]" : "border-black"}
          bg-white
          px-3
        `}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={focused ? PRIMARY_COLOR : "#777"}
        />

        <Dropdown
          style={{ flex: 1, height: 50 }}
          selectedTextStyle={{ color: "black", fontSize: 15 }}
          placeholderStyle={{ color: "#777", fontSize: 14 }}
          data={data}
          labelField="label"
          valueField="value"
          value={valeur}
          placeholder="Select"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(item) => {
            externalOnChange && externalOnChange(item.value);
            setFocused(false);
          }}
        />
      </View>
    </View>
  );
}
