import { useState } from 'react';
import { Platform, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { PRIMARY_COLOR } from '../constants/colors';
import { CheckBoxInterface } from '../constants/interfaces';
import { saveItem } from '../utils/functions';

export default function CheckBox({ text, getValues } : CheckBoxInterface) {
  const [checked, setChecked] = useState(false);

  const handlePress = () => {
    const newState = !checked;
    setChecked(newState);

    if (newState) {
      const values = getValues(); 
      saveItem({key: "profile", value: values});
    }
  };

  return (
    <View className='flex-row items-center'>
      {Platform.OS === "ios" ? 
        <View style={{ transform: [{ scale: 0.6 }] }} className={`border-2 rounded-md border-[${PRIMARY_COLOR}]`}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={handlePress}
            color={PRIMARY_COLOR}
          />
        </View>
      : 
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={handlePress}
          color={PRIMARY_COLOR}
        />
      }
      <Text className='text-lg font-bold'>{text}</Text>
    </View>
  );
}
