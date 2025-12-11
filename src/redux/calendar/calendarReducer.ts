import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {
    calendar: null,
}
const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setCalendar: (state, action) => {
            state.calendar = action.payload;
        },
        clearCalendar: (state) => {
            state.calendar = null;
        },
        removeCalendarTask: (state, action) => {
            const { data } = action.payload;

            Object.keys(state.calendar).forEach(date => {
                state.calendar[date] = state.calendar[date].filter((task: any) =>
                    !(
                        task.name === data.title &&
                        task.dateDebut === data.startDate &&
                        task.dateFin === data.endDate
                    )
                );

                if (state.calendar[date].length === 0) {
                    delete state.calendar[date];
                }
            });
        },
        removeCalendarTasksByGoalName: (state, action) => {
            const { goalToRemove } = action.payload;
            
            Object.keys(state.calendar).forEach(date => {
                state.calendar[date] = state.calendar[date].filter((task: any) => 
                    task.goalName !== goalToRemove
                );

                if (state.calendar[date].length === 0) {
                    delete state.calendar[date];
                }
            });
        }

    }
});
export const { setCalendar, clearCalendar, removeCalendarTask, removeCalendarTasksByGoalName } = calendarSlice.actions;
export default calendarSlice.reducer;
