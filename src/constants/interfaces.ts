import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { KeyboardType } from "react-native";

export interface ChatBotInterface {
    prompt: string
}
export interface AuthDataInterface {
    email: string,
    password: string
}
export interface Message {
    sender: string;
    text: string;
    time: string;
    createdAt?: Date;
}

export interface ChatState {
    messages: Message[];
}

export interface EmptyComponentData {
    emoji: string;
    title: string;
    desc: string;
}

export interface TaskInterface {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    startDate: string;
    endDate: string;
    goalName: string;
    emailNotification: boolean;
    statusUpdatedAt: string;
}
export interface ToDoRenderItemData {
    item: TaskInterface;
}

export interface CheckBoxInterface {
  text: string;
  getValues: () => {
    email: string,
    password: string
  };
}

export interface EditProfileModalInterface {
    userInfo: any,
    visible: boolean, 
    hideModal: ()=>void,
    deleteGoal: (index: number, goals: GoalsInterface[]) => void; // <-- new
} 

export interface AlertVerificationInterface {
  title: string,
  body: string,
  icon: string,
  visible: boolean
  onConfirm: () => void,
  onCancel: () => void,
  cancel?: boolean,
  action: string,
}

export interface AddTaskModalInterface{
    visible: boolean,
    hideModal: () => void
}

export interface GoalsInterface {
    name: string,
    description: string,
    priority: string,
    deadline: string,
    startDate: string
}
export interface AppDropdownPropsInterface{
  control?: Control<any>;
  errors?: FieldErrors<any>;
  name?: string;
  label: string;
  data: any;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onChange?: (value: any ) => void;
  valeur?: string;
}

export interface AppInputInterface {
    control: Control<any>;
    errors: FieldErrors;
    name: any;
    label: string;
    secureTextEntry?: boolean;
    icon: string;
    keyboardType?: KeyboardType;
}

export interface BadgeInterface {
    color: string, 
    text: string, 
    icon?: string, 
    onPress?: () => void, 
    textColor: string
}

export interface AuthFormsPropsInterface {
    control: Control<AuthDataInterface>
    errors: FieldErrors<AuthDataInterface>
    handleSubmit:UseFormHandleSubmit<AuthDataInterface>
    reset: UseFormReset<AuthDataInterface>
    setAuthData: Dispatch<SetStateAction<any>>
}

export interface  FirestoreFilter {
  field: string;
  operator: '<' | '<=' | '==' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any';
  value: any;
};

export interface DeleteItemOptions {
  collectionName: string;        
  filters?: FirestoreFilter[];   
  userId?: string;               
  updateUserField?: string;      
  newUserFieldValue?: any;       
  updateStates?: any[];
};

export interface getItemsOptions {
  collectionName: string;        
  filters?: FirestoreFilter[];   
};

