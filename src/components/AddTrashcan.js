import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';
import PositionContext from '../context/PositionContext'

export const AddTrashcan = ({modalVisible, setModalVisible}) => {

  const { currentPosition, setCurrentPosition } = React.useContext(PositionContext)
  const [description, setDescription] = useState("설명 없음")
  const [ data, setData ] = useState(0)

  const addNewTrashcan = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      includeExif: true,
      cropping: true,
      mediaType: 'photo',
    }).then(async image => {
      console.log(image);

      let temp = {
        latitude : currentPosition.latitude,
        longitude : currentPosition.longitude,
        address : "인천 송도과학로27번길 15",
        image : {uri: image.path, type: "image/jpeg", name: ";alkfsdj;ljkasdf"}
      }
      setData(temp)
    });
  }

  const getLocation = async () => {
    Geolocation.getCurrentPosition(async position => {
      console.log(JSON.stringify(position))
      const {longitude, latitude} = position.coords
      await setCurrentPosition({
        latitude: latitude,
        longitude: longitude,
      })
    })
    console.log(currentPosition)
  }

  const postData = () => {
    var formdata = new FormData();
    formdata.append("latitude", data.latitude);
    formdata.append("longitude", data.longitude);
    formdata.append("address", data.address);
    formdata.append("image", data.image);
    formdata.append("description", description);
    var requestOptions = {
      headers:{
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://112.145.103.184:8000/locations/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    console.log("success!!!!!!!!!!!!!!!!!!!")
    //setModalVisible(modalVisible)
  },[])
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>현재 위치에 쓰레기통을 추가합니다.</Text>
            <View style={styles.itemsContainer}>
              <View style={{...styles.itemContainer, flexDirection: "row"}}>
                <Text style={styles.itemText}>이미지</Text>
                <TouchableHighlight
                  style={styles.cameraButton}
                  onPress={() => {
                    addNewTrashcan()
                    getLocation()
                  }}
                >
                  <Text style={styles.textStyle}>     촬영     </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>설명</Text>
                <TextInput
                  style={{
                    height: 80,
                    borderColor: '#aaaaaa',
                    borderWidth: 0.5,
                    borderRadius: 10
                  }}
                  onChangeText={text => setDescription(text)}
                  placeholder={"간단한 설명을 부탁드립니다! \n ex) 버스정류장 옆 or ~ 가게 앞"}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>     취소     </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    if(data) {
                      setModalVisible(!modalVisible);
                      postData()
                      console.log(";afklsdj;kldfjasd;asfklj")
                    }                        
                  }}
                >
                  <Text style={styles.textStyle}>     확인     </Text>
                </TouchableHighlight>
              </View>       
            </View>     
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2,
    marginHorizontal: 13,
    width: 100
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 30,
    textAlign: "center",
    fontSize: 20
  },
  itemText: {
    marginBottom: 10,
    textAlign: "left"
  },
  buttonContainer : {
    flexDirection: "row",
    //alignContent: "space-around"
    justifyContent: "space-around"
  },
  itemContainer : {
    marginVertical: 20
  },
  itemsContainer: {
    padding: 10
  },
  cameraButton: {
    backgroundColor: "#41B6FF",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    width: 100,
    marginLeft: 130
  }
});
