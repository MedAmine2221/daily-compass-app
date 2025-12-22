import AlertVerification from "@/src/components/AlertVerification";
import AppDropdown from "@/src/components/AppDropdown";
import Badge from "@/src/components/Badge";
import EmptyComponent from "@/src/components/EmptyList";
import ExpandableText from "@/src/components/ExpandableText";
import SearchInput from "@/src/components/SearchInput";
import StatusMenu from "@/src/components/to-do/StatusMenu";
import { priorities } from "@/src/constants";
import { PRIORITY } from "@/src/constants/enums";
import { TaskInterface } from "@/src/constants/interfaces";
import { removeCalendarTask } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { removeTask } from "@/src/redux/task/taskReducer";
import { deleteItem, getStatusIcons } from "@/src/utils/functions";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function InProgressList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const prioritiesList= [
    { label: t("all"), value: "All", shortLabel: t("all") },
    ...priorities
  ]
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskInterface>();
  const [editingTaskId, setEditingTaskId] = useState<number>();
  const [openStatusMenuId, setOpenStatusMenuId] = useState<number>();
  const [selectedPriority, setSelectedPriority] = useState(prioritiesList[0].value);
  const [value, setValue] = useState("");
  const tasksList = useSelector((state: RootState) => state.tasks.tasksInProgress);
  const filterdDataWithValue = useMemo(()=>{
    return tasksList.filter((task)=>task.title.toLowerCase().includes(value.toLowerCase()) && (selectedPriority === "All" ? true : task.priority === selectedPriority));
  },[tasksList, value, selectedPriority]);

  const filterdDataWithoutValue = useMemo(()=>{
    return tasksList.filter((task)=>( selectedPriority === "All" ? true : task.priority === selectedPriority));
  },[tasksList, selectedPriority]);

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
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
        <View className="flex-row w-[50%]">
          <SearchInput onChange={setValue} label={t("todo.searchInput.label")} icon="text-search-variant" />
          <View className="w-[100%] bottom-1">
            <AppDropdown
              label=""
              data={prioritiesList}
              icon="target"
              onChange={setSelectedPriority}
              valeur={selectedPriority}
            />
          </View>
        </View>
        <FlashList
          data={value === "" ? filterdDataWithoutValue : filterdDataWithValue}
          renderItem={({ item, index }: {item:TaskInterface, index:number}) => (
            <View key={index} style={{ marginBottom: 16, marginHorizontal: 12 }}>
              <Card style={{ backgroundColor: "white", elevation: 2 }}>
                {/* En-tête avec titre et priorité */}
                <View style={{ 
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingTop: 16
                }}>
                  <View style={{ flex: 1 }}>
                    <ExpandableText 
                      maxChars={30} 
                      text={item.title} 
                      textColor="black" 
                      textWeight="bold" 
                      textSize={16} 
                    />
                  </View>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontWeight: "bold",
                      fontSize: 16,
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

                {/* Description */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                  <ExpandableText 
                    maxChars={50} 
                    text={item.description} 
                    textColor="black" 
                    textWeight="normal" 
                    textSize={16} 
                  />
                </View>

                {/* Dates */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                  <Text 
                    style={{
                      textAlign: "right", 
                      fontSize: 12, 
                      color: "#888",
                      fontWeight: "500"
                    }}
                  >
                    {item.startDate + " - " + item.endDate}
                  </Text>
                </View>

                {/* Actions */}
                <Card.Actions style={{ 
                  borderTopWidth: 1, 
                  borderTopColor: "#f0f0f0",
                  paddingHorizontal: 8,
                  paddingVertical: 8 
                }}>
                  <View style={{ width: "100%" }}>
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      {/* Badge de statut */}
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
                      
                      {/* Boutons d'action */}
                      <View style={{ flexDirection: "row" }}>
                        {openStatusMenuId === index || editingTaskId === index ? 
                          <IconButton 
                            icon="close" 
                            size={22}
                            iconColor="#666"
                            onPress={() => {
                              setEditingTaskId(undefined);
                              setOpenStatusMenuId(undefined);
                            }} 
                          />
                          : 
                          <IconButton 
                            icon="circle-edit-outline" 
                            size={22}
                            iconColor="#666"
                            onPress={() => setEditingTaskId(index)} 
                          />
                        }
                        <IconButton 
                          icon="trash-can-outline" 
                          size={22}
                          iconColor="#dc2626"
                          onPress={() => {
                            setSelectedTask(item);
                            setOpenModal(true);                          
                          }} 
                        />
                      </View>
                    </View>
                    
                    {/* Menu de statut ou message d'édition */}
                    {openStatusMenuId === index && (
                      <View style={{ marginTop: 8 }}>
                        <StatusMenu from={"todo"} item={item} />
                      </View>
                    )}
                    
                    {editingTaskId === index && openStatusMenuId !== index && (
                      <Text style={{ 
                        color: "#b91c1c", 
                        fontSize: 14, 
                        marginTop: 8,
                        fontStyle: "italic"
                      }}>
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
        {openModal && <AlertVerification
          title={t("verifyDeleteItem.title")}
          body={t("verifyDeleteItem.body")}
          icon={'trash-can-outline'}
          visible={openModal} 
          onConfirm={() => {
            if (selectedTask) onSubmitDelete(selectedTask);
          }}
          onCancel={()=>{setOpenModal(false)}}
          action= "delete"
          cancel
        />}
      </SafeAreaView>
  );
}