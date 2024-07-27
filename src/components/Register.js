import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    Button
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Wrapper from './Wrapper';

export default function RegisterScreen() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
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

    // auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(() => {
    //     Alert.alert('Thành công', 'Tài khoản người dùng đã được tạo và đăng nhập !', [
    //       {
    //         text: 'OK',
    //         onPress: () => navigation.navigate('Login'),
    //       },
    //     ]);
    //   })
    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const {uid} = userCredential.user
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
        });
      });

    })
    .then(() => {
      ToastAndroid.show('Tạo tài khoản thành công', ToastAndroid.SHORT);
      setEmail('');
      setPassword('');
      setRePassword('');
      setFullname('');
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

    const user = auth().currentUser;

    if (user) {
      console.log('Full Name:', user.displayName);
      console.log('Email:', user.email);
      // Bạn có thể lấy thêm các thuộc tính khác như photoURL nếu đã được thiết lập
    }
  };

  return (
    <Wrapper disableAvoidStatusBar={true}>
    <View style={{ flex: 1, backgroundColor: '#D7D9A9' }}>
    <Image
            style={{ width: 400, height: 230, alignSelf: 'center', marginTop: 20 }}
            source={require('../img/baner.png')}
          />
          <Text
            style={{
              fontSize: 34,
              color: '#fff',
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: 20,
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
              marginBottom: 18,
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
      <TouchableOpacity
            style={{
              alignSelf: 'center',
              width: 259,
              height: 50,
              backgroundColor: '#407332',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              elevation: 2,
              margin: 20,
            }}
            onPress={handleRegister}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
              Register
            </Text>
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>
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
        width: 370,
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
