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
            const { title } = action.payload;
            state.tasks = state.tasks.filter((t: TaskInterface) => t.title !== title);
        },
        removeTaskWithGoalName: (state, action) => {
            const { title } = action.payload;
            state.tasks = state.tasks.filter((t: TaskInterface) => t.goalName !== title);
        },
        removeDoneTasks: (state, action) => {
            const { title } =action.payload;
            const doneTasks = state.tasks.find((t: TaskInterface) => t.title === title);            
            state.tasks = state.tasks.filter((t: TaskInterface) => t.title !== title);
            if(doneTasks){
                state.tasksDone.push(doneTasks);
            }
        },
        removeInProgressTasks: (state, action) => {
            const { title } =action.payload;
            const inProgressTasks = state.tasks.find((t: TaskInterface) => t.title === title);            
            state.tasks = state.tasks.filter((t: TaskInterface) => t.title !== title);
            if(inProgressTasks){
                state.tasksInProgress.push(inProgressTasks);
            }
        },
        inProgress_To_Done: (state, action) => {
            const { title } =action.payload;
            const doneTasks = state.tasksInProgress.find((t: TaskInterface) => t.title === title);            
            state.tasksInProgress = state.tasksInProgress.filter((t: TaskInterface) => t.title !== title);
            if(doneTasks){
                state.tasksDone.push(doneTasks);
            }
        },
        inProgress_To_ToDo: (state, action) => {
            const { title } =action.payload;
            const toDo = state.tasksInProgress.find((t: TaskInterface) => t.title === title);            
            state.tasksInProgress = state.tasksInProgress.filter((t: TaskInterface) => t.title !== title);
            if(toDo){
                state.tasks.push(toDo);
            }
        },
        Done_To_InProgress: (state, action) => {
            const { title } =action.payload;
            const inProgressTask = state.tasksDone.find((t: TaskInterface) => t.title === title);            
            state.tasksDone = state.tasksDone.filter((t: TaskInterface) => t.title !== title);
            if(inProgressTask){
                state.tasksInProgress.push(inProgressTask);
            }
        },
        Done_To_ToDo: (state, action) => {
            const { title } =action.payload;
            const todoTask = state.tasksDone.find((t: TaskInterface) => t.title === title);            
            state.tasksDone = state.tasksDone.filter((t: TaskInterface) => t.title !== title);
            if(todoTask){
                state.tasks.push(todoTask);
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