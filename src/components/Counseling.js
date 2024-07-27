import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, Modal, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CounselingScreen = ({ navigation }) => {
    const [selectedArea, setSelectedArea] = useState('');
    const [query, setQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const counselingAreas = [
        { label: 'Chọn lĩnh vực', value: '' },
        { label: 'Căng thẳng', value: 'stress' },
        { label: 'Lo âu', value: 'anxiety' },
        { label: 'Trầm cảm', value: 'depression' },
        { label: 'Vấn đề mối quan hệ', value: 'relationship' }
    ];

    const handleSubmit = async () => {
        if (!selectedArea || !query) {
            Alert.alert('Lỗi', 'Vui lòng chọn lĩnh vực tư vấn và nhập nội dung cần tư vấn.');
            return;
        }

        try {
            await firestore().collection('counselingQueries').add({
                area: selectedArea,
                query: query,
                timestamp: firestore.FieldValue.serverTimestamp(),
                user: auth().currentUser.uid, // Lưu ID người dùng để tham khảo
            });
            Alert.alert('Thành công', 'Câu hỏi của bạn đã được gửi đến chuyên gia.');
            setQuery('');
            setSelectedArea('');
        } catch (error) {
            console.error('Không thể gửi câu hỏi: ', error);
            Alert.alert('Lỗi', 'Không thể gửi câu hỏi của bạn. Vui lòng thử lại sau.');
        }
    };

    const renderPickerItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.pickerItem}
            onPress={() => {
                setSelectedArea(item.value);
                setModalVisible(false);
            }}
        >
            <Text style={styles.pickerItemText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#D7D9A9' }}>
            <View style={{
                backgroundColor: '#407332',
                paddingVertical: 17,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 30, height: 30, marginRight: 60 }}
                        source={require('../img/exit.png')}
                    />
                </TouchableOpacity>
                <Text style={{
                    marginLeft: 50,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#FEF9F3',
                }}>Counseling</Text>
            </View>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Tư vấn tâm lý</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Chọn lĩnh vực tư vấn:</Text>
                <TouchableOpacity 
                    style={styles.customPicker}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.customPickerText}>{counselingAreas.find(area => area.value === selectedArea)?.label || 'Chọn lĩnh vực'}</Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <FlatList 
                                data={counselingAreas}
                                renderItem={renderPickerItem}
                                keyExtractor={item => item.value}
                            />
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Nhập nội dung cần tư vấn:</Text>
                <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Nhập nội dung tại đây..."
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    customPicker: {
        height: 50,
        borderColor: '#407332',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#FEF9F3',
    },
    customPickerText: {
        color: '#000',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FEF9F3',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    pickerItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    pickerItemText: {
        fontSize: 16,
        color: '#407332',
    },
    closeButton: {
        backgroundColor: '#407332',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FEF9F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: '#FEF9F3',
        color: '#000',
        fontSize: 16,
        height: 100,
        borderColor: '#407332',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#407332',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FEF9F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CounselingScreen;
