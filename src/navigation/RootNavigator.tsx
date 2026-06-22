import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const sharedHeaderOptions = {
  headerStyle: { backgroundColor: Colors.background },
  headerShadowVisible: false,
  headerTintColor: Colors.primary,
  headerTitleStyle: {
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    fontSize: 17,
  },
  contentStyle: { backgroundColor: Colors.background },
};

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={sharedHeaderOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={({ navigation }) => ({
            title: 'Task Detail',
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={({ navigation }) => ({
            title: 'New Task',
            presentation: 'modal',
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
