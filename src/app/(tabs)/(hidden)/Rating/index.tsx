import { auth, db } from "@/FirebaseConfig";
import AppInput from "@/src/components/AppInput";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import ratingSchema from "@/src/schema/ratingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, Keyboard, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactUs() {
  const [rating, setRating] = useState(3);
  const ratingCompleted = (r: number) => setRating(r);
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(ratingSchema),
  });
  const user = auth.currentUser;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        {/* ton header d’origine */}
        <View style={{ flex: 1, backgroundColor: PRIMARY_COLOR }}>
          <Text
            style={{
              padding: 10,
              marginTop: 10,
              color: "white",
              fontWeight: "bold",
              fontSize: 25,
              textAlign: "center"
            }}
          >
            {t("rating.header")}
          </Text>
          <Image
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              justifyContent: "center",
              marginTop: 20,
              top: 20,
            }}
            source={require("../../../../assets/images/rating.png")}
          />

          {/* section blanche corrigée */}
          <ScrollView
            style={{
              flex: 1,
              marginTop: 60,
              backgroundColor: "white",
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              paddingHorizontal: 25,
              paddingTop: 30,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 6,
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              className="self-center"
              style={{
                padding: 10,
                marginTop: 5,
                color: "#4b5563",
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              {t("rating.tapStar")}
            </Text>

            <Rating
              showRating
              onFinishRating={ratingCompleted}
              style={{ paddingVertical: 10, marginTop: 10 }}
            />

            {rating <= 2 && (
              <View style={{ marginTop: 25 }}>
                <AppInput
                  control={control}
                  errors={errors}
                  name="problem"
                  label={t("rating.problemsLabel")}
                  icon="bug"
                  multiline
                />
              </View>
            )}

            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Button
                mode="contained"
                labelStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
                style={{
                  width: "70%",
                  backgroundColor: PRIMARY_COLOR,
                  borderRadius: 12,
                  paddingVertical: 5,
                }}
                onPress={
                  rating <= 2 ? 
                    handleSubmit(async (data) => {
                      const tasksRef = collection(db, "rating");
                      await addDoc(tasksRef, {
                        ratingPercent: ( rating/5 ) * 100,
                        reason: data.problem,
                        userId: user?.uid,
                        createdAt: new Date().toISOString(),
                      });
                    })
                    : 
                    async () => {
                      const tasksRef = collection(db, "rating");
                      await addDoc(tasksRef, {
                        ratingPercent: ( rating/5 ) * 100,
                        userId: user?.uid,
                        createdAt: new Date().toISOString(),
                      });
                    }
                }
              >
                {t("rating.submit")}
              </Button>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
