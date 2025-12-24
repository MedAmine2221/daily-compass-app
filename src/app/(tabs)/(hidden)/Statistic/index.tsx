import AppDropdown from "@/src/components/AppDropdown";
import AppHeader from "@/src/components/AppHeader";
import EmptyComponent from "@/src/components/EmptyList";
import { PRIMARY_COLOR } from "@/src/constants/colors";
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
  const tasksInProgress = useSelector((state: RootState) => state.tasks.tasksInProgress);
  const tasksDone = useSelector((state: RootState) => state.tasks.tasksDone);
  const { t } = useTranslation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawGoals =
    useSelector((state: RootState) => state.user.items?.goals) || [];

  const goals = useMemo(() => {
    const mappedGoals = rawGoals.map((goal: GoalsInterface) => ({
      label: goal.name,
      value: goal.name,
      shortLabel:
        goal.name.length > 25
          ? goal.name.slice(0, 25) + "..."
          : goal.name,
    }));

    const urgentGoal = {
      label: "No Goal - Critical Task",
      value: "urgent task",
      shortLabel: "No Goal - Critical Task",
    };

    const exists = mappedGoals.some(
      g => normalize(g.value) === normalize(urgentGoal.value)
    );

    return exists ? mappedGoals : [urgentGoal, ...mappedGoals];
  }, [rawGoals]);


  const [selectedGoal, setSelectedGoal] = useState(
    goals.length > 0 ? goals[0].value : ""
  );
  const total = useMemo(() => {
      const totalTodo = tasks.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(selectedGoal)
      ).length
      const totalInProgress = tasksInProgress.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(selectedGoal)
      ).length
      const totalDone = tasksDone.filter(
          (task: TaskInterface) =>
            normalize(task.goalName) === normalize(selectedGoal)
      ).length;
      const total = totalTodo + totalInProgress + totalDone;
      return total;
  }, [selectedGoal, tasks, tasksDone, tasksInProgress])
  const pieData = useMemo(() => {
    const todo = tasks.filter(
      (task: TaskInterface) =>
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    const pending = tasksInProgress.filter(
      (task: TaskInterface) =>
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    const done = tasksDone.filter(
      (task: TaskInterface) =>
        normalize(task.goalName) === normalize(selectedGoal)
    ).length;

    return [
      {
        value: Number(((todo / total) * 100).toFixed(1)) || 0,
        text: `${((todo / total) * 100).toFixed(1)}%`,
        color: "#ef4444",
        text2: t("statusName.todo"),
      },
      {
        value: Number(((pending / total) * 100).toFixed(1)) || 0,
        text: `${((pending / total) * 100).toFixed(1)}%`,
        color: "#eab308",
        text2: t("statusName.inProgress"),
      },
      {
        value: Number(((done / total) * 100).toFixed(1)) || 0,
        text: `${((done / total) * 100).toFixed(1)}%`,
        color: "#16a34a",
        text2: t("statusName.done"),
      },
    ];

  }, [selectedGoal, t, tasks, tasksDone, tasksInProgress, total]);

  const barData = useMemo(() => {
    return goals.map((g: any) => {
      const todo = tasks.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(g.value)
      ).length;

      const inProgress = tasksInProgress.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(g.value)
      ).length;

      const done = tasksDone.filter(
        (task: TaskInterface) =>
          normalize(task.goalName) === normalize(g.value)
      ).length;

      const totalGoal = todo + inProgress + done;

      return {
        label: g.shortLabel,
        value: totalGoal > 0 ? Number((done / totalGoal) * 100).toFixed(1) : 0,
        frontColor:
          normalize(selectedGoal) === normalize(g.value)
            ? PRIMARY_COLOR
            : "#cccccc",
      };
    });
  }, [goals, tasks, tasksInProgress, tasksDone, selectedGoal]);

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

              {total === 0 ? 
                <EmptyComponent
                  emoji={"📭"}
                  title={t("statEmpty.title")}
                  desc={t("statEmpty.body")}
                />
                :
                <PieChart
                  data={pieData}
                  showText
                  labelsPosition = "mid"
                  textColor="white"
                  textSize={14}
                  textBackgroundRadius={18}
                  innerRadius={70}
                  radius={110}
                  showValuesAsLabels
                />
              }
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
              noOfSections={4}
              stepValue={25}
              endSpacing={100}
              barBorderRadius={6}
              data={barData}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{
                fontSize: 16,
                width: "100%",
              }}
              spacing={150}
              maxValue={100}
            />

          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
