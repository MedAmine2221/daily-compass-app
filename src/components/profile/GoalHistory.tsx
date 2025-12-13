import { RootState } from "@/src/redux/store";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, Modal, Portal, Text } from "react-native-paper";
import { useSelector } from "react-redux";
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

  // Select tasks based on current tab
  const selectedTasks =
    taskList.todo ? tasks : taskList.inProgress ? tasksInProgress : tasksDone;

  // Define complete class strings for each state
  const getCircleClasses = (index: number) => {
    if (index === 0) {
      if (taskList.todo) return "w-5 h-5 rounded-full border-2 bg-red-400 border-red-400";
      if (taskList.inProgress) return "w-5 h-5 rounded-full border-2 bg-orange-400 border-orange-400";
      return "w-5 h-5 rounded-full border-2 bg-green-400 border-green-400";
    }
    if (taskList.todo) return "w-5 h-5 rounded-full border-2 bg-white border-red-300";
    if (taskList.inProgress) return "w-5 h-5 rounded-full border-2 bg-white border-orange-300";
    return "w-5 h-5 rounded-full border-2 bg-white border-green-300";
  };

  const getLineClasses = () => {
    if (taskList.todo) return "w-0.5 h-full bg-red-300 mt-1";
    if (taskList.inProgress) return "w-0.5 h-full bg-orange-300 mt-1";
    return "w-0.5 h-full bg-green-300 mt-1";
  };

  const getCardClasses = (index: number) => {
    if (index === 0) {
      if (taskList.todo) return "flex-1 p-4 rounded-2xl bg-red-100";
      if (taskList.inProgress) return "flex-1 p-4 rounded-2xl bg-orange-100";
      return "flex-1 p-4 rounded-2xl bg-green-100";
    }
    return "flex-1 p-4 rounded-2xl bg-gray-50";
  };

  const getTitleClasses = (index: number) => {
    if (index === 0) {
      if (taskList.todo) return "text-lg font-semibold text-red-900";
      if (taskList.inProgress) return "text-lg font-semibold text-orange-900";
      return "text-lg font-semibold text-green-900";
    }
    return "text-lg font-semibold text-gray-800";
  };

  const getTextClasses = (index: number) => {
    if (index === 0) {
      if (taskList.todo) return "text-sm text-red-700";
      if (taskList.inProgress) return "text-sm text-orange-700";
      return "text-sm text-green-700";
    }
    return "text-sm text-gray-500";
  };

  const getStatusTextClasses = () => {
    if (taskList.inProgress) return "text-xs text-orange-600 font-medium mt-2";
    return "text-xs text-green-600 font-medium mt-2";
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item, index }: any) => (
    <View className="flex-row mb-12">
      <View className="items-center mr-4">
        <View className={getCircleClasses(index)} />
        {/* Afficher statusUpdatedAt pour done et inProgress */}
        {(taskList.done || taskList.inProgress) && item?.statusUpdatedAt && (
          <Text className={getStatusTextClasses()} style={{ marginTop: 4, textAlign: 'center', maxWidth: 70 }}>
            {formatDate(item.statusUpdatedAt)}
          </Text>
        )}
        {index < selectedTasks.length - 1 && (
          <View
            className={getLineClasses()}
            style={{ minHeight: 60 }}
          />
        )}
      </View>

      <View className={getCardClasses(index)}>
        <View className="flex-row justify-between items-start mb-2">
          <Text className={getTitleClasses(index)} style={{ flex: 1, marginRight: 8 }}>
            {item?.title}
          </Text>
          <Text className={getTextClasses(index)} numberOfLines={1}>
            {item?.startDate} - {item?.endDate}
          </Text>
        </View>
        <Text className={getTextClasses(index)}>
          {item?.description || "No description"}
        </Text>
      </View>
    </View>
  );

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
          padding: 20,
          borderRadius: 30,
          height: 500,
          maxHeight: "85%",
        }}
      >
        {/* Tabs */}
        <View className="flex-row justify-around items-center mb-4">
          <View className={taskList.todo ? "bg-red-200 rounded-full" : "bg-red-100 rounded-full"}>
            <IconButton
              icon="format-list-bulleted"
              iconColor="red"
              size={25}
              onPress={() =>
                setTaskList({ todo: true, inProgress: false, done: false })
              }
            />
          </View>
          <View className={taskList.inProgress ? "bg-orange-200 rounded-full" : "bg-orange-100 rounded-full"}>
            <IconButton
              icon="clock-time-two-outline"
              iconColor="orange"
              size={25}
              onPress={() =>
                setTaskList({ todo: false, inProgress: true, done: false })
              }
            />
          </View>
          <View className={taskList.done ? "bg-green-200 rounded-full" : "bg-green-100 rounded-full"}>
            <IconButton
              icon="check-circle-outline"
              iconColor="green"
              size={25}
              onPress={() =>
                setTaskList({ todo: false, inProgress: false, done: true })
              }
            />
          </View>
        </View>

        {/* Search Input */}
        <View className="mb-4">
          <SearchInput onChange={setValue} label="search with task name" icon="text-search-variant" />
        </View>

        {/* FlashList Container */}
        <View style={{ flex: 1, minHeight: 300 }}>
          {filteredTasks.length > 0 ? (
            <FlashList
              data={filteredTasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500 text-base">No tasks found</Text>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
}