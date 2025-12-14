import { RootState } from "@/src/redux/store";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, Modal, Portal, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import EmptyComponent from "../EmptyList";
import SearchInput from "../SearchInput";

export default function GoalHistoryModal({ goalInfo, visible, hideModal }: any) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks).filter(
    (task) => task.goalName === goalInfo.name
  );
  const tasksInProgress = useSelector((state: RootState) => state.tasks.tasksInProgress).filter(
    (task) => task.goalName === goalInfo.name
  );
  const tasksDone = useSelector((state: RootState) => state.tasks.tasksDone).filter(
    (task) => task.goalName === goalInfo.name
  );
  const [taskList, setTaskList] = useState({
    todo: true,
    inProgress: false,
    done: false,
  });

  const [value, setValue] = useState("");

  const closeModal = () => {
    hideModal();
  };

  const selectedTasks =
    taskList.todo ? tasks : taskList.inProgress ? tasksInProgress : tasksDone;

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item, index }: any) => {
    const isFirst = index === 0;
    const isLast = index === selectedTasks.length - 1;

    return (
      <View className="flex-row mb-8">
        <View className="items-center mr-5">
          {/* Circle */}
          <View
            className={
              isFirst
                ? taskList.todo
                  ? "w-6 h-6 rounded-full bg-red-400"
                  : taskList.inProgress
                  ? "w-6 h-6 rounded-full bg-orange-400"
                  : "w-6 h-6 rounded-full bg-green-400"
                : taskList.todo
                ? "w-5 h-5 rounded-full border-2 bg-white border-red-200"
                : taskList.inProgress
                ? "w-5 h-5 rounded-full border-2 bg-white border-orange-200"
                : "w-5 h-5 rounded-full border-2 bg-white border-green-200"
            }
            style={isFirst ? {
              shadowColor: taskList.todo ? "#ef4444" : taskList.inProgress ? "#f97316" : "#22c55e",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            } : undefined}
          />

          {/* Date Badge */}
          {item?.statusUpdatedAt && (
            <Text
              className={
                taskList.inProgress
                  ? "text-xs font-semibold mt-2 bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-center"
                  : taskList.todo
                    ? "text-xs font-semibold mt-2 bg-orange-50 text-red-600 px-2 py-1 rounded-full text-center"
                    : "text-xs font-semibold mt-2 bg-green-50 text-green-600 px-2 py-1 rounded-full text-center"
              }
              style={{ maxWidth: 75 }}
            >
              {formatDate(item.statusUpdatedAt)}
            </Text>
          )}

          {/* Line */}
          {!isLast && (
            <View
              className={
                taskList.todo
                  ? "w-0.5 bg-red-200 mt-2"
                  : taskList.inProgress
                  ? "w-0.5 bg-orange-200 mt-2"
                  : "w-0.5 bg-green-200 mt-2"
              }
              style={{ minHeight: 70, flex: 1 }}
            />
          )}
        </View>

        {/* Card */}
        <View
          className={
            isFirst
              ? taskList.todo
                ? "flex-1 p-5 rounded-2xl bg-red-50 border border-red-200"
                : taskList.inProgress
                ? "flex-1 p-5 rounded-2xl bg-orange-50 border border-orange-200"
                : "flex-1 p-5 rounded-2xl bg-green-50 border border-green-200"
              : "flex-1 p-5 rounded-2xl bg-white border border-gray-100"
          }
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: isFirst ? 2 : 1,
          }}
        >
          <View className="flex-row justify-between items-start mb-3">
            <Text
              className={
                isFirst
                  ? taskList.todo
                    ? "text-lg font-bold text-red-900 flex-1"
                    : taskList.inProgress
                    ? "text-lg font-bold text-orange-900 flex-1"
                    : "text-lg font-bold text-green-900 flex-1"
                  : "text-lg font-semibold text-gray-800 flex-1"
              }
            >
              {item?.title}
            </Text>
            <View className="bg-gray-100 py-1 rounded-full">
              <Text
                className={
                  isFirst
                    ? taskList.todo
                      ? "text-xs font-medium text-red-700"
                      : taskList.inProgress
                      ? "text-xs font-medium text-orange-700"
                      : "text-xs font-medium text-green-700"
                    : "text-xs text-gray-600"
                }
                numberOfLines={1}
              >
                {item?.startDate} - {item?.endDate}
              </Text>
            </View>
          </View>
          <Text
            className={
              isFirst
                ? taskList.todo
                  ? "text-sm font-medium text-red-700 leading-5"
                  : taskList.inProgress
                  ? "text-sm font-medium text-orange-700 leading-5"
                  : "text-sm font-medium text-green-700 leading-5"
                : "text-sm text-gray-600 leading-5"
            }
          >
            {item?.description || "No description"}
          </Text>
        </View>
      </View>
    );
  };

  const filteredTasks = selectedTasks.filter((task) =>
    task.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 28,
          maxHeight: "88%",
          height:600,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Header */}
        <View className="mb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-1">
            {goalInfo?.name || "Task History"}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Track your progress
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around items-center p-2 mb-5">
          <View
            className={`${taskList.todo ? "bg-red-500" : "bg-transparent"}`}
            style={taskList.todo ? {
              borderRadius: "100%",
              padding: 2,
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            } : { padding: 2 }}
          >
            <IconButton
              icon="format-list-bulleted"
              iconColor={taskList.todo ? "white" : "#ef4444"}
              size={24}
              onPress={() =>
                setTaskList({ todo: true, inProgress: false, done: false })
              }
            />
          </View>
          <View
            className={taskList.inProgress ? "bg-orange-500" : "bg-transparent"}
            style={taskList.inProgress ? {
              borderRadius: "100%",
              padding: 2,
              shadowColor: "#f97316",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            } : { padding: 2 }}
          >
            <IconButton
              icon="clock-time-two-outline"
              iconColor={taskList.inProgress ? "white" : "#f97316"}
              size={24}
              onPress={() =>
                setTaskList({ todo: false, inProgress: true, done: false })
              }
            />
          </View>
          <View
            className={taskList.done ? "bg-green-500" : "bg-transparent"}
            style={taskList.done ? {
              borderRadius: "100%",
              padding: 2,
              shadowColor: "#22c55e",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            } : { padding: 2 }}
          >
            <IconButton
              icon="check-circle-outline"
              iconColor={taskList.done ? "white" : "#22c55e"}
              size={24}
              onPress={() =>
                setTaskList({ todo: false, inProgress: false, done: true })
              }
            />
          </View>
        </View>

        {/* Search Input */}
        <View className="mb-5">
          <SearchInput onChange={setValue} label="search with task name" icon="text-search-variant" />
        </View>

        {/* FlashList Container */}
        <View style={{ flex: 1, minHeight: 300 }}>
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
              title={"No tasks found"}
              desc={"Try a different search term"}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
}