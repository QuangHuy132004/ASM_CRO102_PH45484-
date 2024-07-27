import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({navigation}) => {
  const [data, setData] = useState([]);
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewContent, setViewContent] = useState('');

  const currentUser = auth().currentUser;
  const uid = currentUser ? currentUser.uid : null;

  const handleSavePost = async () => {
    if (!content) {
      Alert.alert('Lỗi', 'Vui lòng điền nội dung.');
      return;
    }

    try {
      const userProfileImage = currentUser.photoURL || 'default-image-url'; // Thay thế bằng hình ảnh mặc định nếu null
      const userEmail = currentUser.email; // Lấy email của người dùng

      if (isEditing) {
        await firestore().collection('users').doc(uid).collection('posts').doc(currentId).update({
          content,
          createAt: firestore.FieldValue.serverTimestamp(),
          profileImage: userProfileImage,
          userEmail: userEmail // Lưu email người dùng
        });
        Alert.alert('Thành công', 'Đã cập nhật dữ liệu thành công.');
      } else {
        await firestore().collection('users').doc(uid).collection('posts').add({
          content,
          createAt: firestore.FieldValue.serverTimestamp(),
          profileImage: userProfileImage,
          userEmail: userEmail // Lưu email người dùng
        });
        Alert.alert('Thành công', 'Đã thêm dữ liệu thành công.');
      }
      setModalVisible(false);
      setContent('');
      setIsEditing(false);
      setCurrentId(null);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu bài đăng: ', error);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu.');
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await firestore().collection('users').doc(uid).collection('posts').doc(id).delete();
      Alert.alert('Thành công', 'Đã xoá dữ liệu thành công.');
      fetchData();
    } catch (error) {
      console.error('Lỗi khi xoá bài đăng: ', error);
      Alert.alert('Lỗi', 'Không thể xoá dữ liệu.');
    }
  };

  const fetchData = async () => {
    try {
      const postCollections = await firestore().collection('users').doc(uid).collection('posts').get();
      const postData = postCollections.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createAt: data.createAt ? data.createAt.toDate().toLocaleDateString() : 'Unknown'
        };
      });
      setData(postData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài đăng: ', error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]);

  const renderItem = ({ item }) => (
    <LinearGradient
      colors={['#407332', '#8EBF6B']}
      style={{
        width: '100%',
        paddingVertical: 25,
        paddingLeft: 50,
        marginVertical: 8,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        position: 'relative'
      }}
    >
      {/* Hình ảnh đại diện người dùng */}
      <Image
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          width: 43,
          height: 43,
          borderRadius: 20,
          zIndex: 1
        }}
        source={require('../img/man.png')}
      />
      <View style={{ flex: 1, bottom: 15 }}>
        {/* Email người dùng */}
        <View style={{ marginTop: 2 }}>
          <Text style={{
            left: 12,
            fontSize: 20,
            fontWeight: '400',
            color: '#fff',
          }}>{item.userEmail}</Text>
        </View>

        <View>
          {/* Ngày */}
          <View style={{ marginBottom: 0 }}>
            <Text style={{
              left: 15,
              fontSize: 13,
              fontWeight: '500',
              color: '#FEF9F3',
            }}>{item.createAt}</Text>
          </View>
        </View>

        {/* Nội dung */}
        <View>
          <Text
            ellipsizeMode='tail'
            numberOfLines={1}
            style={{
              top: 7,
              right: 30,
              fontSize: 20,
              fontWeight: '900',
              color: '#FEF9F3',
              width: 150
            }}
            onPress={() => {
              setViewContent(item.content);
              setViewModalVisible(true);
            }}
          >{item.content}</Text>
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      }}>
        <TouchableOpacity onPress={() => {
          setIsEditing(true);
          setCurrentId(item.id);
          setContent(item.content);
          setModalVisible(true);
        }}>
          <Image style={{ marginHorizontal: 8, width: 40, height: 40 }} source={require('../img/updateee.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
          <Image style={{ marginHorizontal: 8, width: 40, height: 40 }} source={require('../img/deletee.png')} />
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );

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
          color: '#fff',
        }}>Please write what you think of here</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 85,
        right: 19,
      }}>
        <Image source={require('../img/Addd.png')} />
      </TouchableOpacity>

      {/* ADD & UPDATE MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: 300,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              textAlign: 'center'
            }}>{isEditing ? 'Edit Post' : 'Add New Post'}</Text>
            <TextInput
              style={{
                width: '100%',
                height: 180,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                marginBottom: 20,
                textAlignVertical: 'top'
              }}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline={true}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#D7D9A9',
                  borderRadius: 15,
                  padding: 10,
                  margin: 10,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={handleSavePost}
              >
                <Image style={{ width: 45, height: 45 }} source={require('../img/updated.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#D7D9A9',
                  borderRadius: 15,
                  padding: 10,
                  margin: 10,
                  width: '40%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => setModalVisible(false)}
              >
                <Image style={{ width: 45, height: 45 }} source={require('../img/cancelled.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DETAILS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: 300,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              textAlign: 'center'
            }}>Xem nội dung</Text>
            <ScrollView style={{
              width: '100%',
              height: 180,
              borderColor: '#ddd',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}>
              <Text style={{ fontSize: 16, color: '#000' }}>{viewContent}</Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: '#D7D9A9',
                borderRadius: 15,
                padding: 10,
                margin: 10,
                width: '40%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => setViewModalVisible(false)}
            >
              <Image style={{ width: 45, height: 45 }} source={require('../img/cancelled.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 70,
          backgroundColor: '#407332',
        }}>
        <TouchableOpacity>
          <Image
            style={{ left: 30, height: 37, width: 37, resizeMode: 'contain', marginBottom: 5 }}
            source={require('../img/chatt.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Music');
        }}>
          <Image
            style={{ left: 10, height: 37, width: 37, resizeMode: 'contain', marginBottom: 5 }}
            source={require('../img/mind.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Run');
        }}>
          <Image
            style={{ right: 10, height: 37, width: 37, resizeMode: 'contain', marginBottom: 5 }}
            source={require('../img/healthy.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          navigation.navigate('BMI');
        }}>
          <Image
            style={{ right: 20, height: 37, width: 37, resizeMode: 'contain', marginBottom: 5 }}
            source={require('../img/bmi.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Menu');
        }}>
          <Image
            style={{ right: 30, height: 37, width: 37, resizeMode: 'contain', marginBottom: 5 }}
            source={require('../img/list.png')}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default Home;
