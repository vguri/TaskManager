import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { RecentlyDeletedScreen } from '../screens/RecentlyDeletedScreen';

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

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.headerBtn}>
      <Ionicons name="arrow-back" size={22} color={Colors.primary} />
    </Pressable>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.headerBtn}>
      <Ionicons name="close" size={22} color={Colors.primary} />
    </Pressable>
  );
}

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
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          })}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={({ navigation }) => ({
            title: 'New Task',
            presentation: 'modal',
            headerLeft: () => <CloseButton onPress={() => navigation.goBack()} />,
          })}
        />
        <Stack.Screen
          name="RecentlyDeleted"
          component={RecentlyDeletedScreen}
          options={({ navigation }) => ({
            title: 'Recently Deleted',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});
