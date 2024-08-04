import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Resetpass = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const checkEmailExists = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    try {
      // Gửi email đặt lại mật khẩu
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi đến địa chỉ của bạn.');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Lỗi', 'Email không tồn tại.');
      } else {
        console.error('Không thể gửi email đặt lại mật khẩu: ', error);
        Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={checkEmailExists}>
        <Text style={styles.buttonText}>Gửi email đặt lại mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Resetpass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#D7D9A9',
  },
  goBackButtonText: {
    color: '#FEF9F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#407332',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FEF9F3',
  },
  button: {
    backgroundColor: '#407332',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FEF9F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
