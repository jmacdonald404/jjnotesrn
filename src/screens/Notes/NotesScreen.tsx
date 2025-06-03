
// src/screens/Notes/NotesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notes Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotesScreen;