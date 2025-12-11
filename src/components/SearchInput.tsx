import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { PRIMARY_COLOR } from '../constants/colors';

export default function SearchInput({
  label,
  icon,
  onChange
}: {
  label: string;
  icon: string;
  onChange: (item: string) => void
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View className='m-4'>
      <TextInput
      onChangeText={(value)=>onChange(value)}
        mode="outlined"
        label={label}
        left={
          <TextInput.Icon
            icon={icon}
            color={
              focused
                ? PRIMARY_COLOR
                : '#777'
            }
          />
        }
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        outlineStyle={{
          borderColor: focused
            ? PRIMARY_COLOR
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
    </View>
  );
}