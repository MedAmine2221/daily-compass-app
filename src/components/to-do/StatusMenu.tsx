import { auth } from '@/src/FirebaseConfig';
import { STATUS } from '@/src/constants/enums';
import { TaskInterface } from '@/src/constants/interfaces';
import { removeCalendarTask } from '@/src/redux/calendar/calendarReducer';
import { Done_To_InProgress, Done_To_ToDo, inProgress_To_Done, inProgress_To_ToDo, removeDoneTasks, removeInProgressTasks, updateTask, updateTaskDone, updateTaskInProgress } from '@/src/redux/task/taskReducer';
import { getItems, updateItems } from '@/src/utils/functions';
import { useTranslation } from 'react-i18next';
import { View } from "react-native";
import { Icon, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';

export default function StatusMenu({from, item}:{from: string; item: TaskInterface}) {
    const dispatch = useDispatch();
    const user = auth.currentUser;
    const { t } = useTranslation();
    const updateStatus = async (status: string) => {
      
        const snapshot = await getItems({
          collectionName: "tasks",
          filters: [
            {
              field: "userId",
              operator: '==',
              value: user?.uid,
            },
            {
              field: "goalName",
              operator: '==',
              value: item?.goalName,
            },
            {
              field: "title",
              operator: '==',
              value: item?.title,
            },
            {
              field: "endDate",
              operator: '==',
              value: item?.endDate,
            },
            {
              field: "startDate",
              operator: '==',
              value: item?.startDate,
            },
          ]
        })
        if (snapshot && !snapshot.empty) {
          const now = new Date().toISOString();
          await Promise.all(snapshot.docs.map((d) =>
              updateItems({
                collectionName: "tasks", 
                userId: d.id, 
                dataToUpdated: { status, statusUpdatedAt: now }
              })
          ));
          dispatch(updateTask({ title: item.title, updatedData: { status, statusUpdatedAt: now } }));
          dispatch(updateTaskDone({ title: item.title, updatedData: { status, statusUpdatedAt: now } }));
          dispatch(updateTaskInProgress({ title: item.title, updatedData: { status, statusUpdatedAt: now } }));
          const calendarPayload = {
            data: {
              title: item.title,
              startDate: item.startDate,
              endDate: item.endDate,
            }
          };
          switch (from) {            
            case STATUS.TODO:
              switch (status) {
                case STATUS.DONE:
                  dispatch(removeDoneTasks({ item }));
                  dispatch(removeCalendarTask(calendarPayload));
                  break;

                case STATUS.InProgress:
                  dispatch(removeInProgressTasks({ item }));
                  break;
              }
              break;

            case STATUS.InProgress:
              switch (status) {
                case STATUS.DONE:
                  dispatch(inProgress_To_Done({ item }));
                  dispatch(removeCalendarTask(calendarPayload));
                  break;

                case STATUS.TODO:                  
                  dispatch(inProgress_To_ToDo({ item }));
                  break;
              }
              break;

            case STATUS.DONE:
              switch (status) {
                case STATUS.InProgress:
                  dispatch(Done_To_InProgress({ item }));
                  break;

                case STATUS.TODO:
                  dispatch(Done_To_ToDo({ item }));
                  break;
              }
              break;
          }
        }
    }
  return (
    <View className='bg-white rounded-lg shadow-lg w-[40%]'>
        <Menu.Item 
            leadingIcon={() => <Icon source={"format-list-checks"} size={24} color="black" />}        
            onPress={() => updateStatus("todo")} 
            title={t("todo.status.todo")}
            titleStyle={{ color: 'black' }}
            style={{ backgroundColor: "rgb(252 165 165)", borderColor: "rgb(239 68 68)", borderWidth: 2 }}
        />
        <Menu.Item 
            leadingIcon={() => <Icon source={"progress-clock"} size={24} color="black" />}        
            onPress={() => updateStatus("inProgress")} 
            title={t("todo.status.inProgress")}
            titleStyle={{ color: 'black' }}
            style={{ marginTop: 2, backgroundColor: "rgb(234 179 8)", borderColor: "rgb(202 138 4)", borderWidth: 2 }}
        />
        <Menu.Item 
            leadingIcon={() => <Icon source={"check-all"} size={24} color="black" />}        
            onPress={() => updateStatus("done")} 
            title={t("todo.status.done")}
            titleStyle={{ color: 'black' }}
            style={{ marginTop: 2, backgroundColor: "rgb(34 197 94)", borderColor: "rgb(22 163 74)", borderWidth: 2 }}
        />
    </View>
  );
}
