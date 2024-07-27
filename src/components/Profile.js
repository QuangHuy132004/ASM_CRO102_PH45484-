import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
const Profile = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [genre, setGenre] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [birthday, setBirthday] = useState('');

    const handleDateChange = (date) => {
        setBirthday(date);
    };
    
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                try {
                    const userDocument = await firestore().collection('users').doc(uid).get();
                    if (userDocument.exists) {
                        const userData = userDocument.data();
                        setFullname(userData.fullname || '');
                        setEmail(userData.email || '');
                        setGenre(userData.genre || '');
                        setWeight(userData.weight || '');
                        setHeight(userData.height || '');
                        setBirthday(userData.birthday || '');
                    } else {
                        console.log('User document does not exist.');
                    }
                } catch (error) {
                    console.log('Error fetching user data: ', error);
                }
            } else {
                console.log('No user is logged in.');
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const uid = currentUser.uid;
            try {
                await firestore().collection('users').doc(uid).update({
                    fullname,
                    email,
                    genre,
                    weight,
                    height,
                    birthday,
                });
                Alert.alert('User information updated successfully');
                // Optional: Navigate back to Profile screen or show a success message
                navigation.goBack();
            } catch (error) {
                console.log('Error updating user information: ', error);
            }
        }
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#D7D9A9' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#407332',
                paddingVertical: 17,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image 
                                style={{width: 30, height: 30, marginRight: 60}}
                                source={require('../img/exit.png')}
                            />
                        </TouchableOpacity>
                <Text style={{
                    marginLeft: 60,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#FEF9F3',
                }}>Profile</Text>
            </View>
            <View style={{ marginTop: 50 }}>
                <Text style={styles.label}>Fullname</Text>
                <TextInput
                    style={[styles.input, {fontSize: 17}]}
                    placeholder='Fullname'
                    value={fullname}
                    onChangeText={setFullname}
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, {fontSize: 17}]}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Genre</Text>
                <TextInput
                    style={[styles.input, {fontSize: 17}]}
                    placeholder='Genre'
                    value={genre}
                    onChangeText={setGenre}
                />
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.column}>
                    <Text style={styles.label}>Weight {'(kg)'}</Text>
                    <TextInput
                        style={[styles.input, { width: 115, fontSize: 17 }]}
                        placeholder="kg"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>Height {'(m)'}</Text>
                    <TextInput
                        style={[styles.input, { width: 115, fontSize: 17 }]}
                        placeholder="cm"
                        value={height}
                        onChangeText={setHeight}
                    />
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>Birthday</Text>
                    <TextInput
                        style={[styles.input, { width: 115, fontSize: 17 }]}
                        placeholder="Birthday"
                        value={birthday}
                        onChangeText={setBirthday}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>SUBMIT</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    label: {
        marginLeft: 26,
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    input: {
        height: 50,
        width: 360,
        marginVertical: 8,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
        color: 'black',
        borderRadius: 8,
        borderColor: '#000',
        elevation: 3,
        alignSelf: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    submitButton: {
        width: 190,
        height: 50,
        backgroundColor: '#407332',
        borderRadius: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    submitButtonText: {
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold',
    },
});
