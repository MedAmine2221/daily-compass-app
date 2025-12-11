import { TaskInterface } from "@/src/constants/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {tasks: TaskInterface[], tasksDone: TaskInterface[]} = {
    tasks: [],
    tasksDone:[],
}
const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTask: (state, action) => {            
            state.tasks.push(action.payload);
        },
        clearTask: (state) => {
            state.tasks = [];
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
        updateTask: (state, action) => {
            const { title, updatedData } = action.payload;
            const index = state.tasks.findIndex((task: TaskInterface) => task.title === title);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updatedData };
            }
        },
    }
});
export const { setTask, clearTask, removeTask, updateTask, removeTaskWithGoalName, removeDoneTasks } = taskSlice.actions;
export default taskSlice.reducer;