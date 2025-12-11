import { View } from 'react-native';
import { Button, Icon, Modal, Portal, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { PRIMARY_COLOR } from '../constants/colors';
import { AlertVerificationInterface } from '../constants/interfaces';
import { RootState } from '../redux/store';

export default function AlertVerification({ 
  title, 
  body, 
  icon, 
  visible, 
  onConfirm, 
  onCancel 
}: AlertVerificationInterface) {  
  const loading = useSelector((state: RootState)=> state.loading.loading)
  return (
    <Portal> 
        <Modal 
            visible={visible}
            onDismiss={onCancel}
            contentContainerStyle={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 40,
            }}
        >
            <View className='bg-red-100 p-4 w-16 h-16 rounded-lg items-center justify-center' >
                <Icon source={icon} color='red' size={25} />
            </View>

            <View>
                <Text style={{fontWeight: "bold", fontSize: 18}} className="mt-4 mb-2">
                    {title}
                </Text>
                <Text style={{fontSize: 14, color: "gray"}}>
                    {body}
                </Text>
            </View>

            <View className='flex-row justify-end mt-6 space-x-4'>
                <Button 
                    mode='outlined'
                    theme={{colors: { outline: PRIMARY_COLOR }}}
                    onPress={onCancel}
                >
                    Cancel
                </Button>

                <Button 
                    mode='contained' 
                    buttonColor={loading ? PRIMARY_COLOR+"50" : PRIMARY_COLOR} 
                    onPress={onConfirm}
                >
                    {loading ? "Confirm...": "Confirm"}
                </Button>
            </View>
        </Modal>
    </Portal>
  );
}
