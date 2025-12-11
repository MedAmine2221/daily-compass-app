import { PRIMARY_COLOR } from "@/src/constants/colors";
import { useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";

export function FloatingIndicator({ activeIndex }: { activeIndex: number }) {
  const { width } = Dimensions.get('window');
  const TAB_COUNT = 3;
  const INDICATOR_WIDTH = width / TAB_COUNT - 16;
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const tabWidth = width / TAB_COUNT;
    const targetX = tabWidth * activeIndex + (tabWidth - INDICATOR_WIDTH) / 2;

    Animated.spring(translateX, {
      toValue: targetX,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [activeIndex, scaleAnim, opacityAnim, translateX, width, INDICATOR_WIDTH]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 10,
        height: 50,
        width: INDICATOR_WIDTH,
        borderRadius: 22,
        backgroundColor: PRIMARY_COLOR,
        transform: [{ translateX }, { scale: scaleAnim }],
        opacity: opacityAnim,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      }}
    />
  );
}