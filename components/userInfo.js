import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserInfo = ({ user }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ marginRight: 2, flexDirection: 'column' }} onPress={() => navigation.navigate('Profile')}>
      <View style={{ overflow: 'hidden', borderRadius: 50, height: 96, width: 96, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' }}>
        <Image source={require('../assets/images/default-avatar.png')} style={{ borderRadius: 20, height: 96, width: 96 }} />
      </View>
      <View style={{ alignItems: 'left', justifyContent: 'center', marginLeft: 3, marginTop: 2 }}>
        <Text style={{ color: 'white', fontSize: 14 }}>
          {user.email || 'Test Name'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserInfo;
