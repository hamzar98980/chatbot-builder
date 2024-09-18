import { combineReducers } from "redux";
import ChatReducer from "./Chat";
import ChatPopupReducer from "./ChatPopup";
import EmailReducer from "./Email";
import Theme from "./Theme";
import ToDoReducer from "./ToDo";
import UsersSlice from "./Users";
import ChatSlice from "./Chat";
import MessageSlice from "./Message";

const reducers = combineReducers({
  theme: Theme,
  chatReducer: ChatReducer,
  emailReducer: EmailReducer,
  chatPopupReducer: ChatPopupReducer,
  toDoReducer: ToDoReducer,
  usersReducer: UsersSlice,
  chatReducer: ChatSlice,
  messageReducer: MessageSlice,
});

export default reducers;
