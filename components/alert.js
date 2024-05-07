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
        <TouchableOpacity className="flex-1 justify-end items-center" onPress={onClose} >
          <Text className="bg-green-300 p-4 w-full h-17 border rounded-lg">
            {message}
          </Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  