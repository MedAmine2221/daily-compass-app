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
        updateTask: (state, action) => {
            const { title, updatedData } = action.payload;
            const index = state.tasks.findIndex((task: TaskInterface) => task.title === title);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updatedData };
            }
        },
    }
});
export const { setTask,setTaskInProgress, setTaskDone, clearTask, removeTask, updateTask, removeTaskWithGoalName, removeDoneTasks, removeInProgressTasks } = taskSlice.actions;
export default taskSlice.reducer;