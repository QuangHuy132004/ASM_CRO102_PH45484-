import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ToastAndroid
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Wrapper from './Wrapper';

export default function RegisterScreen() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isUser, setIsUser] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!fullname || !email || !password || !rePassword) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
        return;
    }

    if (password !== rePassword) {
        Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
        return;
    }

    if (!isUser && !isExpert) {
        Alert.alert('Lỗi', 'Vui lòng chọn loại tài khoản.');
        return;
    }

    const role = isUser ? 'User' : 'Expert';

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const { uid } = userCredential.user;
      console.log('UID của người dùng:', uid); // Log uid ra console để kiểm tra
      return userCredential.user.updateProfile({
        displayName: fullname,
      })
      .then(() => {
        return firestore().collection('users').doc(uid).set({
          fullname: fullname,
          email: email,
          password: password,
          genre: '', // Giá trị mặc định
          weight: '', // Giá trị mặc định
          height: '', // Giá trị mặc định
          birthday: '', // Giá trị mặc định
          role: role, // Lưu loại tài khoản
        });
      });

    })
    .then(() => {
      ToastAndroid.show('Tạo tài khoản thành công', ToastAndroid.SHORT);
      setEmail('');
      setPassword('');
      setRePassword('');
      setFullname('');
      setIsUser(false);
      setIsExpert(false);
      navigation.navigate('Login'); // Điều hướng người dùng về trang đăng nhập
    })
    .catch(err => {
      if (err.code === 'auth/email-already-in-use') {
        ToastAndroid.show('Địa chỉ email đã tồn tại', ToastAndroid.SHORT);
      }

      if (err.code === 'auth/invalid-email') {
        ToastAndroid.show('Địa chỉ email không hợp lệ', ToastAndroid.SHORT);
      }

      console.log(`Lỗi tạo tài khoản: ${err}`);
    });
  };

  return (
    <Wrapper disableAvoidStatusBar={true}>
      <View style={{ flex: 1, backgroundColor: '#D7D9A9' }}>
        <Image
          style={{ width: 340, height: 230, alignSelf: 'center', marginTop: 10 }}
          source={require('../img/baner.png')}
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
            marginBottom: 12,
          }}>
          Please Log into your existing account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Fullname"
          placeholderTextColor="#828282"
          value={fullname}
          onChangeText={value => setFullname(value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#828282"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#828282"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Re Password"
          placeholderTextColor="#828282"
          value={rePassword}
          onChangeText={value => setRePassword(value)}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isUser}
            onValueChange={setIsUser}
            tintColors={{ true: '#407332', false: '#828282' }}
            style={styles.checkbox}
          />
          <Text style={styles.label}>User</Text>

          <CheckBox
            value={isExpert}
            onValueChange={setIsExpert}
            tintColors={{ true: '#407332', false: '#828282' }}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Expert</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', marginTop: 5, fontSize: 18 }}>
            already have a account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{ color: '#407332' }}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    width: 300,
    marginVertical: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 8,
    borderColor: '#d3d3d3',
    elevation: 3,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: -10,
    justifyContent: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    margin: 8,
  },
  label: {
    margin: 12,
    fontSize: 19,
    color: '#407332',
  },
  button: {
    alignSelf: 'center',
    width: 259,
    height: 50,
    backgroundColor: '#407332',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
