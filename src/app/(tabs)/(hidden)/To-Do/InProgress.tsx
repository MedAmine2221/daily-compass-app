import AlertVerification from "@/src/components/AlertVerification";
import AppDropdown from "@/src/components/AppDropdown";
import Badge from "@/src/components/Badge";
import EmptyComponent from "@/src/components/EmptyList";
import SearchInput from "@/src/components/SearchInput";
import { AddTaskModal } from "@/src/components/to-do/AddTaskModal";
import StatusMenu from "@/src/components/to-do/StatusMenu";
import { priorities } from "@/src/constants";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { PRIORITY } from "@/src/constants/enums";
import { TaskInterface } from "@/src/constants/interfaces";
import { removeCalendarTask } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { removeTask } from "@/src/redux/task/taskReducer";
import { deleteItem, getStatusIcons } from "@/src/utils/functions";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AnimatedFAB, Card, DefaultTheme, IconButton, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function InProgressList() {
  const [isExtended, setIsExtended] = React.useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskInterface>();
  const [editingTaskId, setEditingTaskId] = useState<number>();
  const [openStatusMenuId, setOpenStatusMenuId] = useState<number>();
  const [selectedPriority, setSelectedPriority] = useState(PRIORITY.CRITICAL)
  const [value, setValue] = useState("");
  const tasksList = useSelector((state: RootState) => state.tasks.tasksInProgress);
  const filterdData = useMemo(()=>{
    return tasksList.filter((task)=>task.title === value && task.priority === selectedPriority);
  },[tasksList, value, selectedPriority]);
    
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };
  const onSubmitDelete = async (item: TaskInterface) => {    
    await deleteItem(
      {
        collectionName: "tasks",
        filters: [
          { field: "title", operator: "==", value: item.title },
        ],
        updateStates: [
          removeTask(item),
          removeCalendarTask({data: item})
        ],
      },
      dispatch,
      closeModal
    );
  }
  const closeModal = () =>{
    setOpenModal(false);
    dispatch(setLoadingFalse());
  }
  const hideModal = useCallback(() => setVisible(false), []);
  return (
    <PaperProvider 
      theme={
        {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: '#f3f4f6',
            surface: 'white',
            primary: PRIMARY_COLOR,
          },
        }
      }
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
        <View className="flex-row w-[50%]">
          <SearchInput onChange={setValue} label={t("todo.searchInput.label")} icon="text-search-variant" />
          <View className="w-[100%] bottom-1">
            <AppDropdown
              label=""
              data={priorities}
              icon="target"
              onChange={setSelectedPriority}
              valeur={selectedPriority}
            />
          </View>
        </View>
        <FlashList
          data={value === "" && selectedPriority === PRIORITY?.CRITICAL ? tasksList : filterdData}
          onScroll={onScroll}
          renderItem={({ item, index }: {item:TaskInterface, index:number}) => (
            <View key={index} style={{ marginBottom: 16, marginHorizontal: 12 }}>
              <Card style= {{ backgroundColor: "white" }}>
                <View className="flex-row justify-between items-center w-[70%]">
                  <Card.Title title={item.title} />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontWeight: "bold",
                      color:
                        item.priority === PRIORITY.MEDIUM
                          ? "#f59e0b"
                          : item.priority === PRIORITY.LOW
                          ? "#15803d"
                          : item.priority === PRIORITY.HIGH 
                          ? "#b91c1c"
                          : "#424242",
                    }}
                  >
                    {item.priority}
                  </Text>
                </View>
                <Card.Content>
                  <Text variant="bodyMedium">{item.description}</Text>
                  <Text className="self-end mt-4" variant="bodyMedium" style={{fontWeight: "bold"}}>{item.startDate +" - " + item.endDate}</Text>
                </Card.Content>
                <Card.Actions>
                  <View className="flex-col">
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Badge 
                        text={t("todo.status."+item.status)} 
                        color={item.status === "inProgress"
                          ? "rgb(234 179 8)"
                          : item.status === "done"
                          ? "rgb(34 197 94)"
                          : "rgb(252 165 165)"
                        }
                        textColor={item.status === "inProgress"
                          ? "rgb(202 138 4)"
                          : item.status === "done"
                          ? "rgb(22 163 74)"
                          : "rgb(239 68 68)"
                        }
                        icon={getStatusIcons(item.status)}
                        onPress={() => {
                          if (editingTaskId === index) {
                            setOpenStatusMenuId(index);
                          }
                        }}
                      />                  
                      <View style={{ flexDirection: "row" }}>
                        {
                        openStatusMenuId === index || editingTaskId === index ? 
                          <IconButton 
                            icon="close" 
                            onPress={() => {
                              setEditingTaskId(undefined);
                              setOpenStatusMenuId(undefined);
                            }} 
                          />
                          : 
                          <IconButton icon="circle-edit-outline" onPress={() => setEditingTaskId(index)} />
                        }
                        <IconButton icon="trash-can-outline" onPress={ () => {
                          setSelectedTask(item);
                          setOpenModal(true)                          
                        }} />
                      </View>
                    </View>
                    {openStatusMenuId === index && <StatusMenu from={"inProgress"} item={item} />}
                    {editingTaskId === index && (
                      <Text style={{ color: "#b91c1c" }}>
                        {t("todo.changeStatus.message")}
                      </Text>
                    )}
                  </View>
                </Card.Actions>
              </Card>
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-20">
              <EmptyComponent
                emoji="🏖️"
                title={t("todo.empty.title")}
                desc={t("todo.empty.desc")+"😎"}
                />
            </View>
          }
        />

        <AnimatedFAB
          icon="plus"
          label={t("todo.addTaskButton")}
          color="white"
          extended={isExtended}
          onPress={() => setVisible(true)}
          visible
          animateFrom="right"
          iconMode="dynamic"
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: PRIMARY_COLOR,
            borderRadius: 16,
            elevation: 6,
          }}
        
          theme={{
            colors: { onSecondaryContainer: "white" },
          }}
        />
      </SafeAreaView>
      {openModal && <AlertVerification
        title={"Are you sure you want to delete this item?"}
        body={"This action cannot be undone."}
        icon={'trash-can-outline'}
        visible={openModal} 
        onConfirm={() => {
          if (selectedTask) onSubmitDelete(selectedTask);
        }}
        onCancel={()=>{setOpenModal(false)}}
        action= "delete"
        cancel
      />}
      {visible && (
        <AddTaskModal visible={visible} hideModal={hideModal} />
      )}
    </PaperProvider>
  );
}