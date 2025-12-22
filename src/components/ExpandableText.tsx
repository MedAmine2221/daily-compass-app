import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { PRIMARY_COLOR } from "../constants/colors";
import { splitText } from "../utils/functions";

export default function ExpandableText({
  text,
  textColor,
  textSize,
  textWeight,
  maxChars = 20,
}: {
  text: string;
  textSize: number;
  textWeight: "bold" | "normal";
  textColor: string;
  maxChars?: number;
}) {  
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const lines = splitText(text, maxChars);
  
  const hasMore = lines.length > 1;

  const displayedText = expanded
    ? lines.join(" - ")
    : lines[0] + (text.length > maxChars ? "..." : "");

  return (
    <View style={{ flexShrink: 1 }}>
      <Text
        style={{
          color: textColor,
          fontSize: textSize,
          fontWeight: textWeight,
        }}
      >
        {displayedText}

        {hasMore && (
          <Text
            onPress={() => setExpanded(!expanded)}
            style={{
              color: PRIMARY_COLOR,
              fontWeight: "bold",
            }}
          >
            {" "}
            {expanded ? t("viewLess") : t("viewMore")}
          </Text>
        )}
      </Text>
    </View>
  );
}
