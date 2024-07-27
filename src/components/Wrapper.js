import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, ScrollView, View } from 'react-native';

const Wrapper = ({ children, style, disableAvoidStatusBar = false, ...props }) => {
  return (
    <View style={[styles.wrapper, style]} {...props}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default Wrapper;
