import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';

const Menu = ({ navigation }) => {
    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => {
                // Điều hướng về màn hình đăng nhập sau khi đăng xuất thành công
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error('Failed to log out: ', error);
            });
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
                }}>Exercise Health</Text>
            </View>

            <View style={{ flex: 1, padding: 20 }}>
                {/* Profile Section */}
                <View style={{
                    backgroundColor: '#407332',
                    padding: 20,
                    borderRadius: 20,
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            style={{ height: 53, width: 53, borderRadius: 25, marginBottom: 10 }}
                            source={require('../img/man.png')} // Thay thế bằng nguồn hình ảnh thực tế
                        />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#FEF9F3',
                    }}>Nguyen Quang Huy</Text>
                </View>

                {/* Menu Grid */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Friend')}>
                            <Image
                                style={styles.icon}
                                source={require('../img/friend.png')}
                            />
                            <Text style={styles.buttonText}>Friend</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Group')}>
                            <Image
                                style={styles.icon}
                                source={require('../img/group.png')}
                            />
                            <Text style={styles.buttonText}>Group</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Counseling')}>
                            <Image
                                style={styles.icon}
                                source={require('../img/tuvan.png')}
                            />
                            <Text style={styles.buttonText}>Psychological counseling</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('TrainingGoals')}>
                            <Image
                                style={styles.icon}
                                source={require('../img/training.png')}
                            />
                            <Text style={styles.buttonText}>Training goals</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Support')}>
                            <Image
                                style={styles.icon}
                                source={require('../img/phonee.png')}
                            />
                            <Text style={styles.buttonText}>Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
                            <Image
                                style={styles.icon}
                                source={require('../img/logoutt.png')}
                            />
                            <Text style={styles.buttonText}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Footer Navigation */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 70,
                backgroundColor: '#407332',
                paddingHorizontal: 30,
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image
                        style={styles.footerIcon}
                        source={require('../img/chatt.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Music')}>
                    <Image
                        style={styles.footerIcon}
                        source={require('../img/mind.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Run')}>
                    <Image
                        style={styles.footerIcon}
                        source={require('../img/healthy.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('BMI')}>
                    <Image
                        style={styles.footerIcon}
                        source={require('../img/bmi.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    // navigation.navigate('ContactScreen');
                }}>
                    <Image
                        style={styles.footerIcon}
                        source={require('../img/list.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = {
    menuButton: {
        backgroundColor: '#407332',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '48%',
    },
    icon: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FEF9F3',
        textAlign: 'center',
    },
    footerIcon: {
        height: 37,
        width: 37,
        resizeMode: 'contain',
    }
};

export default Menu;
