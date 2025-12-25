import { STATUS } from "@/src/constants/enums";
import { TaskInterface } from "@/src/constants/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {tasks: TaskInterface[], tasksDone: TaskInterface[], tasksInProgress: TaskInterface[]} = {
    tasks: [],
    tasksDone:[],
    tasksInProgress:[],
}
const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTask: (state, action) => {
            switch(action.payload.status){
                case STATUS.TODO : 
                    state.tasks.push(action.payload); 
                    break;
                case STATUS.InProgress : 
                    state.tasksInProgress.push(action.payload); 
                    break;
                case STATUS.DONE : 
                    state.tasksDone.push(action.payload); 
                    break;
                default: console.warn("Unknown status:", action.payload.status);
            }         
        },
        setTaskInProgress: (state, action) => {            
            state.tasksInProgress.push(action.payload);
        },
        setTaskDone: (state, action) => {            
            state.tasksDone.push(action.payload);
        },
        clearTask: (state) => {
            state.tasks = [];
            state.tasksInProgress = [];
            state.tasksDone = [];
        },
        removeTask: (state, action) => {
            const { item } = action.payload;
            state.tasks = state.tasks.filter((t: TaskInterface) => t.title !== item.title && t.startDate !== item.startDate && t.endDate !== item.endDate);
        },
        removeTaskWithGoalName: (state, action) => {
            const { title } = action.payload;            
            state.tasks = state.tasks.filter((t: TaskInterface) => t.goalName !== title);
            state.tasksInProgress = state.tasksInProgress.filter((t: TaskInterface) => t.goalName !== title);
            state.tasksDone = state.tasksDone.filter((t: TaskInterface) => t.goalName !== title);
        },
        removeDoneTasks: (state, action) => {
            const { item } = action.payload;
            const doneTaskIndex = state.tasks.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (doneTaskIndex !== -1) {
                const [doneTask] = state.tasks.splice(doneTaskIndex, 1);
                state.tasksDone.push(doneTask);
            }
        },
        removeInProgressTasks: (state, action) => {
            const { item } = action.payload;
            const inProgressTaskIndex = state.tasks.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (inProgressTaskIndex !== -1) {
                const [inProgressTask] = state.tasks.splice(inProgressTaskIndex, 1); // supprime du tasks
                state.tasksInProgress.push(inProgressTask); // ajoute à tasksDone
            }
        },
        inProgress_To_Done: (state, action) => {
            const { item } = action.payload;
            const doneTasksIndex = state.tasksInProgress.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (doneTasksIndex !== -1) {
                const [doneTask] = state.tasksInProgress.splice(doneTasksIndex, 1); // supprime du tasks
                state.tasksDone.push(doneTask); // ajoute à tasksDone
            }
        },
        inProgress_To_ToDo: (state, action) => {
            const { item } = action.payload;
            const todoTasksIndex = state.tasksInProgress.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (todoTasksIndex !== -1) {
                const [todoTask] = state.tasksInProgress.splice(todoTasksIndex, 1); // supprime du tasks
                state.tasks.push(todoTask); // ajoute à tasksDone
            }
        },
        Done_To_InProgress: (state, action) => {
            const { item } = action.payload;
            const inProgressTasksIndex = state.tasksDone.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (inProgressTasksIndex !== -1) {
                const [inProgressTask] = state.tasksDone.splice(inProgressTasksIndex, 1); // supprime du tasks
                state.tasksInProgress.push(inProgressTask); // ajoute à tasksDone
            }
        },
        Done_To_ToDo: (state, action) => {
            const { item } = action.payload;
            const todoTasksIndex = state.tasksDone.findIndex(
                t => t.title === item.title && t.startDate === item.startDate && t.endDate === item.endDate
            );

            if (todoTasksIndex !== -1) {
                const [todoTask] = state.tasksDone.splice(todoTasksIndex, 1); // supprime du tasks
                state.tasks.push(todoTask); // ajoute à tasksDone
            }
        },
        updateTask: (state, action) => {
            const { title, updatedData } = action.payload;
            const index = state.tasks.findIndex((task: TaskInterface) => task.title === title);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updatedData };
            }
        },
        updateTaskInProgress: (state, action) => {
            const { title, updatedData } = action.payload;
            const index = state.tasksInProgress.findIndex((task: TaskInterface) => task.title === title);
            if (index !== -1) {
                state.tasksInProgress[index] = { ...state.tasksInProgress[index], ...updatedData };
            }
        },
        updateTaskDone: (state, action) => {
            const { title, updatedData } = action.payload;
            const index = state.tasksDone.findIndex((task: TaskInterface) => task.title === title);
            if (index !== -1) {
                state.tasksDone[index] = { ...state.tasksDone[index], ...updatedData };
            }
        },
    }
});
export const {
    inProgress_To_Done, 
    Done_To_ToDo, 
    Done_To_InProgress, 
    inProgress_To_ToDo, 
    setTask,
    setTaskInProgress, 
    setTaskDone, 
    clearTask, 
    removeTask, 
    updateTask, 
    removeTaskWithGoalName, 
    removeDoneTasks, 
    removeInProgressTasks,
    updateTaskInProgress,
    updateTaskDone
} = taskSlice.actions;
export default taskSlice.reducer;