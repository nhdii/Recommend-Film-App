import React, { useEffect  } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

export default function Alert({ visible, message, onClose, autoCloseTimeout  }){

    useEffect(() => {
        if (visible && autoCloseTimeout) {
          const timer = setTimeout(() => {
            onClose();
          }, autoCloseTimeout);
          return () => clearTimeout(timer);
        }
      }, [visible, autoCloseTimeout, onClose]);
      
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end items-center">
          <View className="bg-green-300 p-4 w-full h-auto border rounded-lg">
            <Text>{message}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  