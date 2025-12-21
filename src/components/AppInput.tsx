import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { PRIMARY_COLOR } from '../constants/colors';
import { AppInputInterface } from '../constants/interfaces';

export default function AppInput({
  control,
  errors,
  name,
  label,
  secureTextEntry,
  icon,
  keyboardType,
}: AppInputInterface) {
  const [focused, setFocused] = useState(false);
  const [eyeOff, setEyeOff] = useState(true);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <View>
          <TextInput
            multiline={value?.length > 50 && true}
            keyboardType={keyboardType}
            mode="outlined"
            label={label}
            secureTextEntry={!eyeOff}
            right={
              secureTextEntry ?
              <TextInput.Icon
                icon={eyeOff ? "eye-off-outline" : "eye-outline"}
                onPress={() => setEyeOff(prev => !prev)}
                color={
                  focused
                    ? PRIMARY_COLOR
                    : errors[name]
                    ? '#f87171'
                    : '#777'
                }
              /> :
              undefined
            }
            left={
              <TextInput.Icon
                icon={icon}
                color={
                  focused
                    ? PRIMARY_COLOR
                    : errors[name]
                    ? '#f87171'
                    : '#777'
                }
              />
            }
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            onChangeText={onChange}
            value={value}
            outlineStyle={{
              borderColor: focused
                ? PRIMARY_COLOR
                : errors[name]
                ? '#f87171'
                : '#777',
              borderWidth: focused ? 1.5 : 1,
              borderRadius: 15,
            }}
            theme={{
              colors: {
                background: 'white',
              },
            }}
            textColor='black'
          />
        {errors?.[name] &&
            <Text className="my-1 text-center text-red-400 font-bold">
              {String(errors[name]?.message)}
            </Text>
        }
        </View>
      )}
    />
  );
}