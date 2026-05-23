import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { Colors } from './src/theme/colors';
import { Widget } from 'react-native-home-widget';
import { useHabitStore } from './src/store/useHabitStore';
import { format } from 'date-fns';

Widget.registerWidgetTaskHandler(async (taskData) => {
  if (taskData && taskData.widgetAction) {
    const actionUri = taskData.widgetAction;
    if (actionUri.startsWith('habitoWidget://checkoff/')) {
      const habitId = actionUri.split('/').pop();
      const store = useHabitStore.getState();
      const today = format(new Date(), 'yyyy-MM-dd');
      store.toggleCompletion(habitId, today);
      await store.syncToWidget();
    }
  }
});

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <HomeScreen theme={theme} colorScheme={colorScheme} />
    </View>
  );
}
