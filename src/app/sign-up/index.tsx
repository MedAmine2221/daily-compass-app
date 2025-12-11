import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import RegisterForm from '@/src/components/register/RegisterForm';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Register() {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className='flex-1 bg-white justify-between'>
        <Header />
        <RegisterForm/>
        <Footer />
      </SafeAreaView>
    </TouchableWithoutFeedback>
);
}
