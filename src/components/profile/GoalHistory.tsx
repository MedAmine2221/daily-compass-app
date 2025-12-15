import { RootState } from "@/src/redux/store";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton, Modal, Portal, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import EmptyComponent from "../EmptyList";
import SearchInput from "../SearchInput";

export default function GoalHistoryModal({ goalInfo, visible, hideModal }: any) {
  const { t } = useTranslation();

  const tasks = useSelector((state: RootState) => state.tasks.tasks).filter(
    (task) => task.goalName === goalInfo.name
  );
  const tasksInProgress = useSelector(
    (state: RootState) => state.tasks.tasksInProgress
  ).filter((task) => task.goalName === goalInfo.name);
  const tasksDone = useSelector(
    (state: RootState) => state.tasks.tasksDone
  ).filter((task) => task.goalName === goalInfo.name);

  const [taskList, setTaskList] = useState({
    todo: true,
    inProgress: false,
    done: false,
  });

  const [value, setValue] = useState("");

  const selectedTasks = taskList.todo
    ? tasks
    : taskList.inProgress
    ? tasksInProgress
    : tasksDone;

  const filteredTasks = selectedTasks.filter((task) =>
    task.title.toLowerCase().includes(value.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const colorConfig = taskList.todo
    ? {
        main: "red",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        dot: "bg-red-400",
        line: "bg-red-200",
      }
    : taskList.inProgress
    ? {
        main: "orange",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        dot: "bg-orange-400",
        line: "bg-orange-200",
      }
    : {
        main: "green",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        dot: "bg-green-400",
        line: "bg-green-200",
      };

  const renderItem = ({ item, index }: any) => {
    const isFirst = index === 0;
    const isLast = index === filteredTasks.length - 1;

    return (
      <View className="flex-row mb-8">
        {/* TIMELINE */}
        <View className="mr-5 items-center">
          {/* Dot */}
          <View
            className={
              isFirst
                ? `w-6 h-6 rounded-full ${colorConfig.dot}`
                : `w-5 h-5 rounded-full border-2 bg-white ${colorConfig.border}`
            }
          />

          {/* Line */}
          {!isLast && (
            <View
              className={`w-0.5 ${colorConfig.line}`}
              style={{ flex: 1, marginTop: 4 }}
            />
          )}
        </View>

        {/* CARD */}
        <View
          className={`flex-1 p-5 rounded-2xl border ${
            isFirst ? `${colorConfig.bg} ${colorConfig.border}` : "bg-white border-gray-100"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: isFirst ? 2 : 1,
          }}
        >
          {/* Date */}
          {item?.statusUpdatedAt && (
            <Text
              className={`self-start mb-2 text-sm font-semibold px-2 py-0.5 rounded-full ${
                colorConfig.bg
              } ${colorConfig.text}`}
            >
              {`${t("goalHistory.updateStatusMsg")} ${item?.status} ${t("at")} :\n`+formatDate(item.statusUpdatedAt)}
            </Text>
          )}

          {/* Title + range */}
          <View className="flex-row justify-between items-start mb-3">
            <Text
              className={`text-lg ${
                isFirst ? "font-bold" : "font-semibold"
              } text-gray-800 flex-1`}
            >
              {item.title}
            </Text>
            <Text className="text-xs text-gray-500 ml-2">
              {item.startDate} - {item.endDate}
            </Text>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-600 leading-5">
            {item.description || "No description"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 28,
          height: 600,
        }}
      >
        {/* Header */}
        <View className="mb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900">
            {goalInfo?.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("goalHistory.modalTitle")}
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around mb-5">
          <IconButton
            icon="format-list-bulleted"
            iconColor={taskList.todo ? "white" : "#ef4444"}
            containerColor={taskList.todo ? "#ef4444" : "transparent"}
            onPress={() =>
              setTaskList({ todo: true, inProgress: false, done: false })
            }
          />
          <IconButton
            icon="clock-time-two-outline"
            iconColor={taskList.inProgress ? "white" : "#f97316"}
            containerColor={taskList.inProgress ? "#f97316" : "transparent"}
            onPress={() =>
              setTaskList({ todo: false, inProgress: true, done: false })
            }
          />
          <IconButton
            icon="check-circle-outline"
            iconColor={taskList.done ? "white" : "#22c55e"}
            containerColor={taskList.done ? "#22c55e" : "transparent"}
            onPress={() =>
              setTaskList({ todo: false, inProgress: false, done: true })
            }
          />
        </View>

        {/* Search */}
        <View className="mb-5">
          <SearchInput
            onChange={setValue}
            label={t("goalHistory.searchInput.label")}
            icon="text-search-variant"
          />
        </View>

        {/* List */}
        <View style={{ flex: 1 }}>
          {filteredTasks.length > 0 ? (
            <FlashList
              data={filteredTasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyComponent
              emoji="📋"
              title={t("goalHistory.empty.title")}
              desc={t("goalHistory.empty.desc")}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
}
