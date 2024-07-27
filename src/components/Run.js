import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Accelerometer } from 'react-native-sensors';
import auth from '@react-native-firebase/auth';

const Run = ({ navigation }) => {
  const [steps, setSteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(10000); // Mục tiêu số bước chân
  const [isRunning, setIsRunning] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (isRunning) {
      const accSubscription = new Accelerometer({
        updateInterval: 100, // khoảng thời gian cập nhật, có thể điều chỉnh theo ý muốn
      })
      .then((observable) => {
        observable.subscribe(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude > 1.5) {
            setSteps(prevSteps => prevSteps + 1);
          }
        });
      })
      .catch((error) => {
        console.error('Accelerometer subscription error: ', error);
      });

      setSubscription(accSubscription);
    } else {
      subscription?.unsubscribe();
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [isRunning]);

  const handleStart = async () => {
    setSteps(0);
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);

    try {
      await firestore().collection('runningData').add({
        steps: steps,
        timestamp: firestore.FieldValue.serverTimestamp(),
        user: auth().currentUser.uid, // Lưu ID người dùng để tham khảo
      });
      Alert.alert('Thành công', `Bạn đã đi ${steps} bước.`);
    } catch (error) {
      console.error('Không thể ghi dữ liệu: ', error);
      Alert.alert('Lỗi', 'Không thể ghi dữ liệu của bạn. Vui lòng thử lại sau.');
    }
  };

  const checkGoal = () => {
    if (steps >= targetSteps) {
      Alert.alert('Chúc mừng!', 'Bạn đã đạt được mục tiêu số bước chân!');
    } else {
      Alert.alert('Cố lên!', `Bạn chưa đạt được mục tiêu số bước chân. Mục tiêu còn ${targetSteps - steps} bước.`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Exercise Health</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.header}>Chạy Bộ</Text>
        <Text style={styles.steps}>Số bước chân: {steps}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Bắt Đầu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStop}
        >
          <Text style={styles.buttonText}>Dừng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={checkGoal}
        >
          <Text style={styles.buttonText}>Kiểm Tra Mục Tiêu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            style={styles.menuIcon}
            source={require('../img/chatt.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Music')}>
          <Image
            style={styles.menuIcon}
            source={require('../img/mind.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Run')}>
          <Image
            style={styles.menuIcon}
            source={require('../img/healthy.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BMI')}>
          <Image
            style={styles.menuIcon}
            source={require('../img/bmi.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Image
            style={styles.menuIcon}
            source={require('../img/list.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7D9A9',
  },
  headerContainer: {
    backgroundColor: '#407332',
    paddingVertical: 17,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEF9F3',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  steps: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#407332',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FEF9F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    backgroundColor: '#407332',
    alignItems: 'center',
  },
  menuIcon: {
    height: 37,
    width: 37,
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default Run;
