import {
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
  useScrollEdgeBackdropColorScheme,
  useScrollEdgeEffectRef,
} from '@strollerapp/react-native-scroll-edge-effect';

const BAR_CONTENT_HEIGHT = 56;

const ITEMS = Array.from({ length: 40 }, (_, index) => ({
  label: `Item ${index + 1}`,
  isDark: Math.floor(index / 4) % 2 === 1,
}));

function BarContent({ topInset }: { topInset: number }) {
  const deviceColorScheme = useColorScheme();
  const backdropColorScheme = useScrollEdgeBackdropColorScheme();

  const colorScheme = backdropColorScheme ?? deviceColorScheme;

  const color = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={[styles.barContent, { paddingTop: topInset }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <Text style={[styles.barTitle, { color }]}>Scroll edge effect</Text>
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
          <View
            key={item.label}
            style={[styles.row, item.isDark && styles.rowDark]}
          >
            <Text style={[styles.rowLabel, item.isDark && styles.rowLabelDark]}>
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeEffectView
        edge="top"
        height={barHeight}
        shouldAdaptToBackdrop
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
  },
  row: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  rowDark: {
    backgroundColor: '#111111',
  },
  rowLabel: {
    fontSize: 17,
    color: '#000000',
  },
  rowLabelDark: {
    color: '#ffffff',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  barTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
