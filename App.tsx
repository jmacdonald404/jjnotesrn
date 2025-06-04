import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

// Import screens with correct paths
import NotesScreen from './src/screens/NotesScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NoteViewScreen from './src/screens/NoteViewScreen';
import FloatingActionButton from './src/components/FloatingActionButton';

// Import types and providers with correct paths
import { ThemeContextProvider } from './src/context/ThemeContext';
import { NotesContextProvider } from './src/context/NotesContext';
import { SettingsContextProvider } from './src/context/SettingsContext';

export type RootStackParamList = {
  MainTabs: undefined;
  NoteView: { noteId: string };
};

export type TabParamList = {
  Notes: undefined;
  Calendar: undefined;
  Search: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    text: '#000000',
  },
};

function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Notes') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Notes" component={NotesScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen}
          listeners={{
            tabPress: (e) => {
              // Handle search tab specific logic if needed
            },
          }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

      <FloatingActionButton />
    </>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="NoteView" 
        component={NoteViewScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <ThemeContextProvider>
          <SettingsContextProvider>
            <NotesContextProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <AppNavigator />
              </NavigationContainer>
            </NotesContextProvider>
          </SettingsContextProvider>
        </ThemeContextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}