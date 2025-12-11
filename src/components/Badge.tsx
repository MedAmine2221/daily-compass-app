import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { BadgeInterface } from "../constants/interfaces";

export default function Badge(
  {
    color, 
    text, 
    icon, 
    onPress, 
    textColor
  }: BadgeInterface
) {
  return (
    <Pressable
      style={{ 
        flexDirection: icon ? "row" : undefined, 
        alignItems: icon ? "center" : undefined,  
        backgroundColor: color, 
        borderColor: textColor, 
        borderWidth: 1, 
        borderRadius: "10%" 
      }}
      onPress={onPress ? onPress : undefined}
    >
        {icon && 
            <View style={{marginLeft: 5}}>
                <Icon source={icon} size={20} />
            </View>
        }
        <Text style={{ color: "black", fontSize: 16, margin: 8 }}>{text}</Text>
    </Pressable>
  );
}
