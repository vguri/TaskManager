import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TaskProvider } from './src/context/TaskContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <RootNavigator />
      </TaskProvider>
    </SafeAreaProvider>
  );
}
