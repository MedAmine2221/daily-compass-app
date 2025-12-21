import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { PRIMARY_COLOR } from "../constants/colors";
import { splitText } from "../utils/functions";

export default function ExpandableText({ text, maxChars = 20 }:  {
  text: string;
  maxChars?: number;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const lines = splitText(text, maxChars);

  const visibleLines = expanded
    ? lines
    : [
        lines[0] + (text.length > maxChars ? "..." : "")
      ];

  return (
    <View style={{ flexShrink: 1 }}>
      {visibleLines.map((line, index) => (
        <Text key={index} style={{ color: "black" }}>
          {expanded
            ? line + (index < visibleLines.length - 1 ? "-" : "")
            : line}
        </Text>
      ))}

      {lines.length > 1 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={{ color: PRIMARY_COLOR, marginTop: 2 }}>
            {expanded ? t("viewLess") : t("viewMore")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
