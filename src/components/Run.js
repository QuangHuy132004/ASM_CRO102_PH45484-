import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { request, PERMISSIONS } from 'react-native-permissions';
import { filter } from 'rxjs/operators';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const Run = ({ navigation }) => {
  const [steps, setSteps] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [lastAcceleration, setLastAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [goalReached, setGoalReached] = useState(false);
  const [stepGoal, setStepGoal] = useState(null); 
  const [inputGoal, setInputGoal] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
        if (result === 'granted') {
          startAccelerometer();
        }
      } else {
        startAccelerometer();
      }
    };

    requestPermission();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [subscription]);

  const startAccelerometer = () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 100ms

    const accelSubscription = accelerometer
      .pipe(
        filter(({ x, y, z }) => {
          const acceleration = Math.sqrt(x * x + y * y + z * z);
          return acceleration > 2.5;
        }),
      )
      .subscribe(({ x, y, z }) => {
        if (isRunning) {
          const deltaX = Math.abs(x - lastAcceleration.x);
          const deltaY = Math.abs(y - lastAcceleration.y);
          const deltaZ = Math.abs(z - lastAcceleration.z);

          if (deltaX > 1 || deltaY > 1 || deltaZ > 1) {
            setSteps(prevSteps => prevSteps + 1);
          }

          setLastAcceleration({ x, y, z });
        }
      });

    setSubscription(accelSubscription);
  };

  useEffect(() => {
    if (stepGoal !== null && steps >= stepGoal && !goalReached) {
      setGoalReached(true);
      setIsRunning(false);
      saveStepsToFirestore(steps);
      Alert.alert(
        'Chúc mừng!',
        'Bạn đã đạt được mục tiêu của mình! Bạn có muốn đặt mục tiêu mới không?',
        [
          {
            text: 'Có',
            onPress: () => {
              setStepGoal(null);
              setSteps(0);
              setGoalReached(false);
              setInputGoal('');
            },
          },
          {
            text: 'Không',
            onPress: () => {
              setStepGoal(null);
              setSteps(0);
              setGoalReached(false);
              setInputGoal('');
            },
          },
        ]
      );
    }
  }, [steps]);

  const saveStepsToFirestore = async steps => {
    try {
      await firestore().collection('steps').add({
        date: new Date().toISOString(),
        steps: steps,
        goal: stepGoal,
      });
      console.log('Đã lưu số bước vào Firestore thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu số bước vào Firestore:', error);
    }
  };

  const handleSetGoal = () => {
    const goal = parseInt(inputGoal);
    if (!isNaN(goal) && goal > 0) {
      setStepGoal(goal);
      setGoalReached(false);
      setSteps(0);
      Alert.alert('Thành công', 'Đặt mục tiêu thành công!');
    }
  };

  const handleStart = () => {
    if (stepGoal !== null) {
      setIsRunning(true);
    } else {
      Alert.alert('Đặt mục tiêu trước', 'Vui lòng đặt mục tiêu trước khi bắt đầu.');
    }
  };

  const handleStop = () => {
    if (stepGoal !== null && isRunning && steps > 0) {
      if (steps < stepGoal) {
        Alert.alert('Rất tiếc', 'Bạn chưa đạt đủ mục tiêu.');
      }
      setIsRunning(false);
      saveStepsToFirestore(steps);
      setSteps(0); // Reset số bước về 0
      setStepGoal(null); // Reset mục tiêu về 0
    } else {
      Alert.alert('Không thể dừng', 'Vui lòng đảm bảo bạn đã đặt mục tiêu, bắt đầu và có số bước lớn hơn 0.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}> Exercise Health</Text>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsText}>Step</Text>
        <Text style={styles.stepsText}>{steps}</Text>
      </View>

      <LinearGradient colors={['#407332', '#90EE90']} style={styles.goalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a step goal"
          keyboardType="numeric"
          value={inputGoal}
          onChangeText={setInputGoal}
        />
        <TouchableOpacity onPress={handleSetGoal} style={styles.btn}>
          <Text style={styles.btnText}>Set Goals</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleStart} style={styles.startBtn}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStop} style={styles.stopBtn}>
            <Text style={styles.btnText}>Stop</Text>
          </TouchableOpacity>
        </View>

        {goalReached && (
          <View style={styles.goalMessage}>
            <Text style={styles.goalMessageText}>
              Chúc mừng bạn đã đạt được mục tiêu hôm nay!
            </Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image style={styles.menuIcon} source={require('../img/chatt.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Music')}>
          <Image style={styles.menuIcon} source={require('../img/mind.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Run')}>
          <Image style={styles.menuIcon} source={require('../img/healthy.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BMI')}>
          <Image style={styles.menuIcon} source={require('../img/bmi.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Image style={styles.menuIcon} source={require('../img/list.png')} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  stepsContainer: {
    flexDirection: 'column',
    borderColor: '#407332',
    justifyContent: 'center',
    borderWidth: 10,
    width: 250,
    height: 250,
    marginLeft: 55,//130
    borderRadius: 125,
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  stepsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  goalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    padding: 20,
    height: 300,
    width: 340,
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 39,
  },
  input: {
    height: 60,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 20,
  },
  btn: {
    backgroundColor: '#407332',
    padding: 15,
    borderRadius: 30,
    width: 150,
    height: 60,
    alignSelf: 'center',
    margin: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  goalMessage: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  goalMessageText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // margin: 20,

  },
  startBtn: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    width: 130,
    height: 60,
    alignItems: 'center',
    margin: 10,
  },
  stopBtn: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 30,
    width: 130,
    height: 60,
    alignItems: 'center',
    margin: 10,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
