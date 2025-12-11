import AppHeader from "@/src/components/AppHeader";
import EmptyComponent from "@/src/components/EmptyList";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { RootState } from "@/src/redux/store";
import { formatDate, getDatesBetween, getStatusColorClass } from "@/src/utils/functions";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Jan.','Fév.','Mars','Avr.','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function MyAgenda() {
  const { t } = useTranslation();
  const data = useSelector((state: RootState) => state.calendar.calendar);
  const [selected, setSelected] = useState(new Date().toISOString().split("T")[0]);
  
  const tasks = data?.[selected] || [];
  const markedDates: Record<string, any> = {};
  // Loop through all tasks in the calendar
  Object.entries(data || {}).forEach((dayTasks) => {
    dayTasks.forEach((task: any) => {
      // get all dates between start and end of task
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

  // Ensure selected day is highlighted even if no tasks
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
              backgroundColor: "#ffffff",
              selectedDayBackgroundColor: PRIMARY_COLOR,
              todayTextColor: PRIMARY_COLOR,
              textDisabledColor: "#cbd5e0",
              dotColor: PRIMARY_COLOR,
              selectedDotColor: "#ffffff",
              textDayFontFamily: "System",
              textMonthFontFamily: "System",
              textDayHeaderFontFamily: "System",
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        <View className="mx-4 mb-4">
          <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <Text className="text-lg font-bold text-gray-800 capitalize mb-1">
              {formatDate(selected)}
            </Text>
            <Text className="text-sm text-gray-600 font-medium">
              {tasks?.length} {t("agenda.event")} {tasks?.length > 1 ? "s" : ""}
            </Text>
          </View>

          {/* List events */}
          {tasks?.length > 0 ? (
            <FlatList
              data={tasks}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
                  <View
                    className={`w-1 h-12 rounded mr-4 ${getStatusColorClass(
                      item.status
                    )}`}
                  />
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
