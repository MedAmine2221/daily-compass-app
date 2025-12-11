import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { PRIMARY_COLOR } from "../constants/colors";

export default function AppDatePicker({ 
  control, 
  errors, 
  name, 
  label, 
  icon 
} : any) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const openPicker = (pickerMode: 'date' | 'time' = 'date') => {
    setMode(pickerMode);
    setShow(true);
  };

  const formatDateTime = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <View>
          <Pressable onPress={() => openPicker('date')}>
            <TextInput
              mode="outlined"
              label={label}
              value={value}
              editable={false}
              onFocus={() => {
                setFocused(true);
                openPicker('date');
              }}
              onBlur={() => setFocused(false)}
              left={
                <TextInput.Icon
                  icon={icon || "calendar"}
                  color={
                    focused
                      ? PRIMARY_COLOR
                      : errors[name]
                      ? "#f87171"
                      : "#777"
                  }
                />
              }
              outlineStyle={{
                borderColor: focused
                  ? PRIMARY_COLOR
                  : errors[name]
                  ? "#f87171"
                  : "#777",
                borderWidth: focused ? 1.5 : 1,
                borderRadius: 15,
              }}
              theme={{
                colors: {
                  background: "white",
                },
              }}
              textColor="black"
            />
          </Pressable>

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode={mode}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                if (Platform.OS !== "ios") setShow(false);

                if (selectedDate) {
                  // If currently picking date, open time picker next
                  if (mode === 'date') {
                    onChange(formatDateTime(selectedDate)); // set date first
                    openPicker('time'); // then open time picker
                  } else {
                    onChange(formatDateTime(selectedDate));
                  }
                }
              }}
            />
          )}
        {errors?.[name] &&
          <Text style={{ color: "#f87171", fontWeight:"bold", textAlign: "center" }}>
            {String(errors[name]?.message)}
          </Text>
        }
        </View>
      )}
    />
  );
}
