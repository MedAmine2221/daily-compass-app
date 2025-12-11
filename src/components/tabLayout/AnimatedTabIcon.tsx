import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function AnimatedTabIcon({ 
  name, 
  focused, 
  size,
  label
}: { 
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size: number;
  label: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const labelScale = useRef(new Animated.Value(focused ? 1 : 0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 7,
      }),
      Animated.spring(translateY, {
        toValue:  -8,
        useNativeDriver: true,
        tension: 80,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(labelOpacity, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.spring(labelScale, {
        toValue: focused ? 1 : 0.8,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();
  }, [focused, opacityAnim, scaleAnim, translateY, labelOpacity, labelScale]);

  return (
    <Animated.View
      className="items-center justify-center"
      style={{
        transform: [{ scale: scaleAnim }, { translateY }],
        opacity: opacityAnim,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: 110,
          height: 60,
        }}
      >
        <Ionicons
          name={name}
          size={size}
          color={focused ? 'white' : '#9CA3AF'}
        />
        {focused && (
          <Animated.Text
            style={{
              marginLeft: 8,
              fontSize: 13,
              fontWeight: '700',
              color: 'white',
              opacity: labelOpacity,
              transform: [{ scale: labelScale }],
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );
}
