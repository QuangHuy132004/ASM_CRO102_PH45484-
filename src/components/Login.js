import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ToastAndroid,
    SafeAreaView
} from 'react-native';
import CheckBox from 'react-native-check-box';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSelected, setSelection] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // Load saved email and password on mount
        const loadCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedPassword = await AsyncStorage.getItem('password');
                const rememberMe = await AsyncStorage.getItem('rememberMe');
                if (savedEmail && savedPassword && rememberMe === 'true') {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setSelection(true);
                }
            } catch (error) {
                console.error('Không thể tải thông tin đăng nhập:', error);
            }
        };
        loadCredentials();
    }, []);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                if (isSelected) {
                    try {
                        await AsyncStorage.setItem('email', email);
                        await AsyncStorage.setItem('password', password);
                        await AsyncStorage.setItem('rememberMe', 'true');
                    } catch (error) {
                        console.error('Không thể lưu thông tin đăng nhập:', error);
                    }
                } else {
                    try {
                        await AsyncStorage.removeItem('email');
                        await AsyncStorage.removeItem('password');
                        await AsyncStorage.removeItem('rememberMe');
                    } catch (error) {
                        console.error('Không thể xóa thông tin đăng nhập:', error);
                    }
                }

                // Check the user's role in Firestore
                const uid = userCredential.user.uid;
                const userDoc = await firestore().collection('users').doc(uid).get();
                const userData = userDoc.data();
                const userRole = userData?.role || 'User';

                if (userRole === 'Expert') {
                    ToastAndroid.show('Chào chuyên gia, bạn đã đăng nhập thành công!', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.SHORT);
                }

                navigation.navigate('Home');
            })
            .catch(error => {
                console.log(`Lỗi đăng nhập: ${error}`);
                let errorMessage = 'Đã có lỗi xảy ra';
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Tài khoản không tồn tại';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Địa chỉ email không hợp lệ';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Mật khẩu không đúng';
                        break;
                    default:
                        errorMessage = 'Đã có lỗi xảy ra';
                }
                Alert.alert('Lỗi', errorMessage);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, padding:10, backgroundColor: '#D7D9A9' }}>
            <Image
                style={{ width: 296, height: 281, alignSelf: 'center', marginTop: 10 }}
                source={require('../img/Giang-blogg.png')}
            />
            <Text
                style={{
                    fontSize: 34,
                    color: '#fff',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginTop: 10,
                }}>
                Wellcome Back
            </Text>
            <Text
                style={{
                    fontSize: 17,
                    color: '#407332',
                    fontWeight: '400',
                    alignSelf: 'center',
                    marginVertical: 8,
                    marginBottom: 14
                }}>
                Please Log into your existing account
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#828282"
                value={email}
                onChangeText={value => setEmail(value)}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#828282"
                value={password}
                onChangeText={value => setPassword(value)}
                secureTextEntry
            />
             <View style={{ marginVertical: 12, marginLeft: 28 }}>
                <CheckBox
                    isChecked={isSelected}
                    onClick={() => setSelection(!isSelected)}
                    rightText="Remember Password"
                    rightTextStyle={{ color: '#407332', fontSize: 17, fontWeight: '400' }}
                />
            </View>
            <TouchableOpacity
                style={{
                    alignSelf: 'center',
                    width: 250,
                    height: 50,
                    backgroundColor: '#407332',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    elevation: 2,
                    margin: 10,
                }}
                onPress={handleLogin}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
                    Login
                </Text>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', marginTop: 25, fontSize: 16 }}>
                    Don’t have account? Click{' '}
                    <Text onPress={() => navigation.navigate('Register')} style={{ color: '#407332' }}>Register</Text>
                </Text>
                <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>
                    Forget Password? Click <Text onPress={() => navigation.navigate('Resetpass')} style={{ color: '#407332' }}>Reset</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 52,
        width: 300,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
        color: 'black',
        borderRadius: 8,
        borderColor: '#d3d3d3',
        elevation: 3,
        alignSelf: 'center',
    },
});
