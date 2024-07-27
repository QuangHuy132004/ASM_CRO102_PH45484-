import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BMI = ({ navigation }) => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [bmiAdvice, setBmiAdvice] = useState('');
    const [menu, setMenu] = useState({});

    useEffect(() => {
        // Lấy UID của người dùng hiện tại
        const user = auth().currentUser;
        if (user) {
            const uid = user.uid;
            // Lấy dữ liệu người dùng từ Firestore
            firestore().collection('users').doc(uid).get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        const userData = documentSnapshot.data();
                        setWeight(userData.weight || '');
                        setHeight(userData.height || '');
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data: ", error);
                });
        }
    }, []);

    useEffect(() => {
        if (weight && height) {
            calculateBMI();
        }
    }, [weight, height]);

    const calculateBMI = () => {
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height) / 100; // Chuyển đổi chiều cao từ cm sang mét
        if (!weightNum || !heightNum || heightNum === 0) {
            Alert.alert('Invalid Input', 'Please enter valid weight and height.');
            return;
        }
        const bmi = weightNum / (heightNum * heightNum);
        setBmiResult(bmi.toFixed(1));
        determineBMICategory(bmi);
    };

    const determineBMICategory = (bmi) => {
        let category = '';
        let advice = '';
        let menu = {}; 

        if (bmi < 18.5) {
            category = 'Thiếu cân';
            advice = 'Bạn nên tăng cường chế độ ăn uống và tập luyện để đạt cân nặng lý tưởng.';
            menu = {
                breakfast: 'Yến mạch nấu với sữa, thêm trái cây tươi và hạt chia.',
                lunch: 'Gà nướng hoặc thịt bò, cơm hoặc khoai tây, rau xanh xào.',
                dinner: 'Cá hồi nướng, quinoa hoặc cơm, salad trộn dầu oliu.',
                snacks: 'Sinh tố trái cây với sữa hoặc sữa chua; hạt và quả khô.'
            };
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Bình thường';
            advice = 'Cân nặng của bạn ở mức bình thường. Hãy duy trì chế độ ăn uống và tập luyện hiện tại.';
            menu = {
                breakfast: 'Trứng luộc với bánh mì nguyên cám và một phần trái cây.',
                lunch: 'Ức gà nướng, gạo lứt, và một phần rau củ tươi.',
                dinner: 'Cá hoặc thịt nạc, khoai lang hoặc cơm, salad rau xanh.',
                snacks: 'Hạt và trái cây tươi hoặc sữa chua không đường.'
            };
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Thừa cân';
            advice = 'Bạn nên điều chỉnh chế độ ăn uống và tăng cường tập luyện để giảm cân.';
            menu = {
                breakfast: 'Smoothie rau xanh với sữa hạt và một ít trái cây.',
                lunch: 'Salad lớn với ức gà, đậu, và các loại rau củ; ít dầu hoặc sốt.',
                dinner: 'Cá nướng hoặc thịt nạc, với khoai tây hoặc cơm lứt, và rau xanh hấp.',
                snacks: 'Trái cây tươi hoặc hạt chia với sữa hạt.'
            };
        } else if (bmi >= 30 && bmi < 34.9) {
            category = 'Béo phì cấp độ 1';
            advice = 'Bạn nên có chế độ ăn uống và tập luyện nghiêm ngặt để giảm cân.';
            menu = {
                breakfast: 'Bánh mì nguyên cám với trứng và rau xanh; trà xanh.',
                lunch: 'Salad rau củ lớn với ức gà hoặc cá; dùng ít sốt hoặc dầu.',
                dinner: 'Thịt nạc hoặc cá, với các loại rau xanh hấp; giảm bớt tinh bột.',
                snacks: 'Rau củ cắt nhỏ hoặc một phần trái cây ít calo.'
            };
        } else if (bmi >= 35 && bmi < 39.9) {
            category = 'Béo phì cấp độ 2';
            advice = 'Bạn cần phải có kế hoạch giảm cân nghiêm ngặt và có thể cần tham khảo ý kiến bác sĩ.';
            menu = {
                breakfast: 'Smoothie xanh với rau củ và sữa hạt; thêm một ít hạt chia.',
                lunch: 'Salad lớn với cá, đậu và rau xanh; tránh các thực phẩm chế biến sẵn.',
                dinner: 'Thịt nạc hoặc cá, rau củ nướng hoặc hấp; giảm lượng tinh bột.',
                snacks: 'Trái cây ít calo hoặc rau củ tươi.'
            };
        } else {
            category = 'Béo phì cấp độ 3';
            advice = 'Bạn nên tìm kiếm sự tư vấn từ bác sĩ để có chế độ giảm cân an toàn và hiệu quả.';
            menu = {
                breakfast: 'Sinh tố protein với rau củ và trái cây tươi.',
                lunch: 'Salad với nhiều rau củ và ít protein từ thịt nạc; tránh các món ăn chế biến sẵn.',
                dinner: 'Cá hoặc thịt nạc với rau xanh và các loại đậu; giảm lượng tinh bột.',
                snacks: 'Trái cây tươi hoặc các món ăn nhẹ ít calo.'
            };
        }
        
        setBmiCategory(category);
        setBmiAdvice(advice);
        setMenu(menu);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#D7D9A9' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#407332',
                paddingVertical: 17,
                paddingHorizontal: 20,
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#FEF9F3',
                }}>BMI</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                paddingHorizontal: 20,
            }}>
                <View style={{ flex: 1, marginHorizontal: 5 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: 5,
                        alignSelf: 'center',
                    }}>Weight {'(kg)'}</Text>
                    <TextInput
                        style={{
                            height: 48,
                            marginVertical: 8,
                            borderWidth: 1,
                            padding: 10,
                            backgroundColor: '#fff',
                            color: 'black',
                            borderRadius: 8,
                            borderColor: '#d3d3d3',
                            elevation: 3,
                            alignSelf: 'center',
                            width: 130,
                            borderWidth: 2, 
                            borderColor: '#407332',
                        }}
                        placeholder="kg"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flex: 1, marginHorizontal: 5 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: 5,
                        alignSelf: 'center',
                    }}>Height {'(cm)'}</Text>
                    <TextInput
                        style={{
                            height: 48,
                            marginVertical: 8,
                            borderWidth: 1,
                            padding: 10,
                            backgroundColor: '#fff',
                            color: 'black',
                            borderRadius: 8,
                            borderColor: '#d3d3d3',
                            elevation: 3,
                            alignSelf: 'center',
                            width: 130,
                            borderWidth: 2, 
                            borderColor: '#407332', 
                        }}
                        placeholder="cm"
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={{
                width: '90%',
                height: 485,
                backgroundColor: '#fff',
                alignSelf: 'center',
                marginTop: 30,
                borderRadius: 20,
                elevation: 3,
                padding: 20,
                borderWidth: 2, 
                borderColor: '#407332',
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: '600',
                    color: '#407332',
                    alignSelf: 'center',
                    marginTop: 5,
                }}>BMI Results</Text>
                {bmiResult && (
                    <>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#407332',
                            alignSelf: 'center',
                            marginTop: 20,
                        }}>Your BMI: {bmiResult}</Text>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#407332',
                            alignSelf: 'center',
                            marginTop: 20,
                        }}>{bmiCategory}</Text>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#407332',
                            alignSelf: 'center',
                            marginTop: 20,
                            textAlign: 'center',
                        }}>{bmiAdvice}</Text>

                        {/* Hiển thị menu */}
                        {menu.breakfast && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#407332' }}>Thực đơn ăn uống:</Text>
                                <Text style={{ fontSize: 16, color: '#407332' }}>Sáng: {menu.breakfast}</Text>
                                <Text style={{ fontSize: 16, color: '#407332' }}>Trưa: {menu.lunch}</Text>
                                <Text style={{ fontSize: 16, color: '#407332' }}>Tối: {menu.dinner}</Text>
                                <Text style={{ fontSize: 16, color: '#407332' }}>Snack: {menu.snacks}</Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            <View style={{
                marginTop: 60,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 70,
                backgroundColor: '#407332',
                paddingHorizontal: 30,
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image
                        style={{
                            height: 37,
                            width: 37,
                            resizeMode: 'contain',
                            marginBottom: 5,
                        }}
                        source={require('../img/chatt.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Music')}>
                    <Image
                        style={{
                            height: 37,
                            width: 37,
                            resizeMode: 'contain',
                            marginBottom: 5,
                        }}
                        source={require('../img/mind.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Run')}>
                    <Image
                        style={{
                            height: 37,
                            width: 37,
                            resizeMode: 'contain',
                            marginBottom: 5,
                        }}
                        source={require('../img/healthy.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('BMI')}>
                    <Image
                        style={{
                            height: 37,
                            width: 37,
                            resizeMode: 'contain',
                            marginBottom: 5,
                        }}
                        source={require('../img/bmi.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Menu');
                }}>
                    <Image
                        style={{
                            height: 37,
                            width: 37,
                            resizeMode: 'contain',
                            marginBottom: 5,
                        }}
                        source={require('../img/list.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BMI;
