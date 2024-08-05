import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, Modal, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Counseling2 = ({ navigation }) => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [response, setResponse] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchQueries = async () => {
            const snapshot = await firestore().collection('counselingQueries').orderBy('timestamp', 'desc').get();
            const fetchedQueries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQueries(fetchedQueries);
        };

        fetchQueries();
    }, []);

    const handleRespond = async () => {
        if (!response) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung phản hồi.');
            return;
        }

        try {
            await firestore().collection('counselingQueries').doc(selectedQuery.id).update({
                response,
                responseTimestamp: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Thành công', 'Phản hồi của bạn đã được gửi đi.');
            setResponse('');
            setModalVisible(false);
        } catch (error) {
            console.error('Không thể gửi phản hồi: ', error);
            Alert.alert('Lỗi', 'Không thể gửi phản hồi của bạn. Vui lòng thử lại sau.');
        }
    };

    const renderQueryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.queryItem}
            onPress={() => {
                if (item.response) {
                    Alert.alert('Thông báo', 'Yêu cầu tư vấn này đã được phản hồi.');
                } else {
                    setSelectedQuery(item);
                    setModalVisible(true);
                }
            }}
        >
            <Text style={styles.queryText}>{item.query}</Text>
            <Text style={styles.queryArea}>Lĩnh vực: {item.area}</Text>
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
                    marginLeft: -25,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#FEF9F3',
                }}>Counseling for Experts</Text>
            </View>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Danh sách câu hỏi tư vấn</Text>
                <FlatList 
                    data={queries}
                    renderItem={renderQueryItem}
                    keyExtractor={item => item.id}
                />
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Vấn đề:</Text>
                        <Text style={styles.modalQuery}>{selectedQuery?.query}</Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Nhập phản hồi tại đây..."
                            value={response}
                            onChangeText={setResponse}
                        />
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleRespond}
                        >
                            <Text style={styles.submitButtonText}>Gửi phản hồi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    queryItem: {
        backgroundColor: '#FEF9F3',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    queryText: {
        fontSize: 16,
        color: '#000',
    },
    queryArea: {
        fontSize: 14,
        color: '#407332',
        marginTop: 5,
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
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalQuery: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
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
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#FEF9F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#407332',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FEF9F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Counseling2;
