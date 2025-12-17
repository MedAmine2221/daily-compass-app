import { auth, db } from "@/FirebaseConfig";
import AppInput from "@/src/components/AppInput";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { ratingSchema } from "@/src/schema/ratingSchema";
import { getItems } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, Keyboard, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ContactUs() {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(3);
    const user = auth.currentUser;

  const [voted, setVoted] = useState(false);
  const ratingCompleted = (r: number) => setRating(r);
  const loading = useSelector((state: RootState) => state.loading.loading);
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(ratingSchema(t)),
    defaultValues: {
      problem: '',
    },
  });
  useEffect(() => {
    const fetchRatings = async () => {
      if (!user) return;

      const res = await getItems({
        collectionName: "rating",
        filters: [
          { field: "userId", operator: "==", value: user.uid },
        ],
      });

      if (res && res.docs) {
        const ratingsData = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (ratingsData.length > 0) {
          setVoted(true);
          setRating((ratingsData[0]?.ratingPercent / 100) * 5);
          // Mettre à jour le champ 'problem' dans le formulaire
          reset({ problem: ratingsData[0]?.reason || '' });
        }
      }
    };

    fetchRatings();
  }, [user, reset]);  
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
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 18, color: "#fbbf24" }}>
              {/* Ton message personnalisé */}
              {voted ? t("rating.alreadyVoted") : t("rating.tapStar")}
            </Text>
            <Rating
              showRating ={!voted}
              startingValue={rating}
              onFinishRating={ratingCompleted}
              style={{ paddingVertical: 10, marginTop: 10 }}
              readonly={voted}
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
                  backgroundColor: (loading || voted) ? PRIMARY_COLOR+"50": PRIMARY_COLOR,
                  borderRadius: 12,
                  paddingVertical: 5,
                }}
                onPress={
                  rating <= 2 ? 
                    handleSubmit(async (data) => {
                      dispatch(setLoadingTrue());
                      const tasksRef = collection(db, "rating");
                      await addDoc(tasksRef, {
                        ratingPercent: ( rating/5 ) * 100,
                        reason: data.problem,
                        userId: user?.uid,
                        createdAt: new Date().toISOString(),
                      });
                      setVoted(true);
                      dispatch(setLoadingFalse());
                    })
                    : 
                    async () => {
                      dispatch(setLoadingTrue());
                      const tasksRef = collection(db, "rating");
                      await addDoc(tasksRef, {
                        ratingPercent: ( rating/5 ) * 100,
                        userId: user?.uid,
                        createdAt: new Date().toISOString(),
                      });
                      setVoted(true);
                      dispatch(setLoadingFalse());
                    }
                }
                disabled={loading || voted}
              >
                {loading ? 
                  <ActivityIndicator
                    color= { PRIMARY_COLOR }
                    size={25}
                  />                    
                    :
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
                    {t("rating.submit")}
                  </Text>
                }
              </Button>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
