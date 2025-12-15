import AppDropdown from "@/src/components/AppDropdown";
import AppHeader from "@/src/components/AppHeader";
import EmptyComponent from "@/src/components/EmptyList";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { STATUS } from "@/src/constants/enums";
import { GoalsInterface, TaskInterface } from "@/src/constants/interfaces";
import { RootState } from "@/src/redux/store";
import { normalize } from "@/src/utils/functions";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Statistic() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { t } = useTranslation();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goals =
  useSelector((state: RootState) => state.user.items?.goals)?.map(
    (goal: GoalsInterface) => ({
      label: goal.name,
      value: goal.name,
    })
  ) || [];

  const [selectedGoal, setSelectedGoal] = useState(
    goals.length > 0 ? goals[0].value : ""
  );

  const pieData = useMemo(() => {
    const total = tasks.filter(
      (task: TaskInterface) =>
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    const todo = tasks.filter(
      (task: TaskInterface) =>
        task.status === STATUS.TODO &&
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    const pending = tasks.filter(
      (task: TaskInterface) =>
        task.status === STATUS.InProgress &&
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    const done = tasks.filter(
      (task: TaskInterface) =>
        task.status === STATUS.DONE &&
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    return [
      { value: (todo / total) * 100 || 0, text: `${todo}%`, color: "#16a34a", text2: "To Do" },
      { value: (pending / total) * 100 || 0, text: `${pending}%`, color: "#eab308", text2: "Pending" },
      { value: (done / total) * 100 || 0, text: `${done}%`, color: "#ef4444", text2: "Done" },
    ];
  }, [selectedGoal, tasks]);

  const barData = useMemo(() => {
    return goals.map((g: { label: string, value: string }) => {
      const total = tasks.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(g.value)
      ).length;

      const done = tasks.filter(
        (task: TaskInterface) =>
          task.status === STATUS.DONE &&
          normalize(task.goalName) === normalize(g.value)
      ).length;

      return {
        label: g.label,
        value: total > 0 ? (done / total) * 100 : 0,
        frontColor:
          normalize(selectedGoal) === normalize(g.value)
            ? PRIMARY_COLOR
            : "#cccccc",
      };
    });
  }, [tasks, goals, selectedGoal]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader moduleName={t("modulesNames.stats")} />

      {goals.length === 0 ? (
        <View className="flex-1 justify-center px-4">
          <EmptyComponent
            emoji={"🚫"}
            title={t("statEmpty.title")}
            desc={t("statEmpty.body")}
          />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-2">

          <AppDropdown
            label="Goal Name"
            data={goals}
            icon="target"
            onChange={setSelectedGoal}
            valeur={selectedGoal}
          />

          <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm mt-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2 text-center">
              {t("stats.taskStatusDistribution")}
            </Text>
            <View className="items-center">
              <PieChart
                data={pieData}
                showText
                textColor="white"
                textSize={14}
                textBackgroundRadius={18}
                innerRadius={60}
                radius={90}
                showValuesAsLabels
              />
            </View>

            <View className="flex-row justify-around mt-4">
              {pieData.map((item, index) => (
                <View key={index} className="items-center">
                  <View
                    className="w-3 h-3 rounded-full mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-gray-600 text-sm">{item.text2}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
            <Text className="text-lg font-semibold text-gray-700 mb-2 text-center">
              {t("stats.goalCompletionRate")}
            </Text>
            <BarChart
              barWidth={40}
              noOfSections={5}
              barBorderRadius={6}
              data={barData}
              yAxisThickness={0}
              xAxisThickness={0}
              spacing={40}
              maxValue={100}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
