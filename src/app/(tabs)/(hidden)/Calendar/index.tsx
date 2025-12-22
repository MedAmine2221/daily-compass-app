import AppHeader from "@/src/components/AppHeader";
import EmptyComponent from "@/src/components/EmptyList";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { RootState } from "@/src/redux/store";
import { formatDate, getDatesBetween, getStatusColorClass } from "@/src/utils/functions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
export default function MyAgenda() {
  const { t, i18n } = useTranslation();
  const [calendarKey, setCalendarKey] = useState(0);
  const data = useSelector((state: RootState) => state.calendar.calendar);
  const [selected, setSelected] = useState(new Date().toISOString().split("T")[0]);
  useEffect(() => {
      LocaleConfig.locales[i18n.language === "fr-FR" ? 'fr' : 'en'] = {
        monthNames: [
          t("months.January"),
          t("months.February"),
          t("months.March"),
          t("months.April"),
          t("months.May"),
          t("months.June"),
          t("months.July"),
          t("months.August"),
          t("months.September"),
          t("months.October"),
          t("months.November"),
          t("months.December")
        ],
        monthNamesShort: [
          t("monthsShort.Jan"),
          t("monthsShort.Feb"),
          t("monthsShort.Mar"),
          t("monthsShort.Apr"),
          t("monthsShort.May"),
          t("monthsShort.Jun"),
          t("monthsShort.Jul"),
          t("monthsShort.Aug"),
          t("monthsShort.Sep"),
          t("monthsShort.Oct"),
          t("monthsShort.Nov"),
          t("monthsShort.Dec")
        ],
        dayNames: [
          t("days.Sunday"),
          t("days.Monday"),
          t("days.Tuesday"),
          t("days.Wednesday"),
          t("days.Thursday"),
          t("days.Friday"),
          t("days.Saturday")
        ],
        dayNamesShort: [
          t("daysShort.Sun"),
          t("daysShort.Mon"),
          t("daysShort.Tue"),
          t("daysShort.Wed"),
          t("daysShort.Thu"),
          t("daysShort.Fri"),
          t("daysShort.Sat")
        ],
        today: t("today.Today")
      };

      LocaleConfig.defaultLocale = i18n.language === "fr-FR" ? 'fr' : 'en';
      setCalendarKey(prev => prev + 1);

  }, [i18n.language, t]);

  const tasks = data?.[selected] || [];
  const markedDates: Record<string, any> = {};
  // Mark the dates of the tasks
  Object.entries(data || {}).forEach(([date, dayTasks]) => {
    dayTasks?.forEach((task: any) => {
      const start = task?.dateDebut?.split(" ")[0];
      const end = task?.dateFin?.split(" ")[0];
      const days = getDatesBetween(start, end);

      days.forEach((date, index) => {
        markedDates[date] = {
          startingDay: index === 0,
          endingDay: index === days.length - 1,
          color: PRIMARY_COLOR,
          textColor: "#ffffff",
        };
      });
    });
  });

  // Select current day
  if (!markedDates[selected]) {
    markedDates[selected] = {
      selected: true,
      selectedColor: PRIMARY_COLOR,
      textColor: PRIMARY_COLOR,
    };
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader moduleName={t("modulesNames.agenda")} />
      <ScrollView>
        <View className="bg-white m-4 rounded-2xl shadow-lg overflow-hidden">
          <Calendar
            key={calendarKey}
            markingType="period"
            markedDates={markedDates}
            onDayPress={(day) => setSelected(day.dateString)}
            theme={{
              calendarBackground: "#ffffff",
              textSectionTitleColor: PRIMARY_COLOR,
              selectedDayTextColor: "#ffffff",
              dayTextColor: "#2d3748",
              monthTextColor: "#2d3748",
              arrowColor: PRIMARY_COLOR,
              selectedDayBackgroundColor: PRIMARY_COLOR,
              todayTextColor: PRIMARY_COLOR,
              textDisabledColor: "#cbd5e0",
            }}
          />
        </View>

        <View className="mx-4 mb-4">
          <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <Text className="text-lg font-bold text-gray-800 capitalize mb-1">
              {formatDate(selected, i18n.language)}
            </Text>
            <Text className="text-sm text-gray-600 font-medium">
              {tasks?.length} {t("agenda.event")}{tasks?.length > 1 ? "s" : ""}
            </Text>
          </View>

          {tasks?.length > 0 ? (
            <FlatList
              data={tasks}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
                  <View className={`w-1 h-12 rounded mr-4 ${getStatusColorClass(item.priority)}`} />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-indigo-600 mb-1">
                      {item.dateDebut} → {item.dateFin}
                    </Text>
                    <Text className="text-base font-medium text-gray-800">
                      {item.name}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <EmptyComponent
              emoji="📅"
              title={t("agendaEmpty.title")}
              desc={t("agendaEmpty.body")}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
