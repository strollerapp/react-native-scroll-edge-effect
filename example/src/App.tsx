import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  ScrollEdgeEffectProvider,
  ScrollEdgeEffectView,
  useScrollEdgeEffectRef,
} from '@strollerapp/react-native-scroll-edge-effect';

const BAR_CONTENT_HEIGHT = 88;

const ITEMS = Array.from({ length: 40 }, (_, index) => ({
  label: `Item ${index + 1}`,
}));

function BarContent({ topInset }: { topInset: number }) {
  const colorScheme = useColorScheme();

  const color = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={[styles.barContent, { paddingTop: topInset }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={styles.barTitleRow}>
        <Image
          source={require('./assets/star.png')}
          style={[styles.barIcon, { tintColor: color }]}
        />

        <Text style={[styles.barTitle, { color }]}>Scroll edge effect</Text>
      </View>
    </View>
  );
}

function Screen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useScrollEdgeEffectRef();

  const barHeight = insets.top + BAR_CONTENT_HEIGHT;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingTop: barHeight }}
        contentInsetAdjustmentBehavior="never"
      >
        {ITEMS.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.rowLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeEffectView
        edge="top"
        height={barHeight}
        effectStyle="soft"
        fallback={<View style={styles.barFallback} />}
      >
        <BarContent topInset={insets.top} />
      </ScrollEdgeEffectView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ScrollEdgeEffectProvider>
        <Screen />
      </ScrollEdgeEffectProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 17,
    color: '#000000',
  },
  barFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffffdd',
  },
  barContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  barTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barIcon: {
    width: 20,
    height: 20,
  },
  barTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
