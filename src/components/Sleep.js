import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const HealthyScreen = ({ navigation }) => {
    const [gradientColors, setGradientColors] = useState(['#021228', '#D7D9A9']);
    const [sleepStart, setSleepStart] = useState(null);
    const [sleepEnd, setSleepEnd] = useState(null);
    const [sleepDuration, setSleepDuration] = useState(null);
    const [sleepData, setSleepData] = useState({
        labels: [],
        datasets: [{ data: [] }],
    });
    const [currentImage, setCurrentImage] = useState(require('../img/morning.png'));

    useEffect(() => {
        const fetchData = async () => {
            const sleepRecords = await firestore().collection('sleepRecords').get();
            const data = sleepRecords.docs.map(doc => {
                const record = doc.data();
                return {
                    start: record.start.toDate(),
                    end: record.end.toDate(),
                    duration: record.duration,
                };
            });

            const formattedData = formatChartData(data);
            setSleepData(formattedData);
        };

        fetchData();
    }, []);

    const formatChartData = data => {
        const chartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        };

        data.forEach(record => {
            const date = record.start.toISOString().split('T')[0];
            chartData.labels.push(date);
            chartData.datasets[0].data.push(record.duration / 3600000);
        });

        return chartData;
    };

    const startSleep = () => {
        const start = new Date();
        setSleepStart(start);
        setSleepEnd(null);
        setSleepDuration(null);
        setGradientColors(['#061C3C', '#021228']);
        setCurrentImage(require('../img/cloudy-night.png'));
        console.log('Bắt đầu ngủ', start);
    };

    const endSleep = async () => {
        const end = new Date();
        setSleepEnd(end);

        if (sleepStart) {
            const durationMillis = end - sleepStart;
            setSleepDuration(durationMillis);

            await firestore().collection('sleepRecords').add({
                start: sleepStart,
                end: end,
                duration: durationMillis,
            });

            const newSleepData = [...sleepData.datasets[0].data];
            const newLabels = [...sleepData.labels];
            const date = sleepStart.toISOString().split('T')[0];
            newLabels.push(date);
            newSleepData.push(durationMillis / 3600000);

            setSleepData({
                labels: newLabels,
                datasets: [{ data: newSleepData }],
            });
        }
        setGradientColors(['#021228', '#D7D9A9']);
        setCurrentImage(require('../img/morning.png'));
        console.log('Kết thúc', end);
    };

    const formatDuration = milliseconds => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours} giờ ${minutes} phút ${seconds} giây`;
    };

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
                    <Image
                        style={styles.goBackImage}
                        source={require('../img/exit.png')}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Sleep</Text>
            </View>
            <View style={styles.cloudContainer}>
                <Image
                    source={currentImage}
                    style={styles.cloudImage}
                />
            </View>

            {sleepData.labels.length > 0 && (
                <BarChart
                    data={sleepData}
                    width={screenWidth - 40}
                    height={420}
                    chartConfig={{
                        backgroundColor: '#022d41',
                        backgroundGradientFrom: '#1c4966',
                        backgroundGradientTo: '#2680a6',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#2680a6',
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        marginTop: 20,
                    }}
                />
            )}
            <View style={styles.sleepInfo}>
                {sleepDuration !== null && (
                    <Text style={{ color: 'white' }}>
                        Thời gian ngủ của bạn: {formatDuration(sleepDuration)}
                    </Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btn01} onPress={startSleep}>
                    <Text style={styles.buttonText}>Bắt đầu ngủ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn02} onPress={endSleep}>
                    <Text style={styles.buttonText}>Thực dậy</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default HealthyScreen;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#407332',
    },
    header: {
        backgroundColor: '#407332',
        paddingVertical: 17,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 10,
    },
    goBack: {
        position: 'absolute',
        left: 20,
    },
    goBackImage: {
        width: 30,
        height: 30,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FEF9F3',
    },
    cloudContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 60,
    },
    cloudImage: {
        width: 140,
        height: 140,
    },
    sleepInfo: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    btn01: {
        backgroundColor: '#407332',
        width: 150,
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    btn02: {
        backgroundColor: '#407332',
        width: 150,
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
