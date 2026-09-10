# @strollerapp/react-native-scroll-edge-effect

Attach an iOS 26 scroll edge effect to a React Native scroll view, shaped by your own overlay bar.

iOS only. Everywhere else the component is a plain view holding your `fallback` and children.

> **Using Expo?** Use [`@bsky.app/expo-scroll-edge-effect`](https://github.com/bluesky-social/expo-scroll-edge-effect) instead. It is the original, it is maintained by the Bluesky team, and it supports all four edges and every `UIScrollEdgeEffect` style. This package is a minimal alternative for bare React Native projects without `expo-modules-core`: top and bottom edges, the `soft` style, no runtime dependencies.

## Installation

```sh
npm install @strollerapp/react-native-scroll-edge-effect
cd ios && pod install
```

## Usage

The scroll view and the bar are siblings, so a provider passes the scroll view handle between them.

```tsx
import {
  ScrollEdgeEffectProvider,
  ScrollEdgeEffectView,
  useScrollEdgeEffectRef,
} from '@strollerapp/react-native-scroll-edge-effect';

function Screen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useScrollEdgeEffectRef();

  const barHeight = insets.top + 56;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingTop: barHeight }}
        contentInsetAdjustmentBehavior="never"
      >
        {/* … */}
      </ScrollView>

      <ScrollEdgeEffectView edge="top" height={barHeight}>
        <Header style={{ paddingTop: insets.top }} />
      </ScrollEdgeEffectView>
    </View>
  );
}

export default function App() {
  return (
    <ScrollEdgeEffectProvider>
      <Screen />
    </ScrollEdgeEffectProvider>
  );
}
```

`withScrollEdgeEffectProvider(Screen)` is available if you would rather wrap at the navigator.

## API

### `ScrollEdgeEffectView`

| Prop                    | Type                   | Description                                                                                                                              |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `edge`                  | `'top' \| 'bottom'`    | Required. Which scroll view edge to shape. Only one view can own a given scroll view and edge; a second one is refused and renders bare. |
| `height`                | `number`               | Required. Height of the bar and of the blurred region. Content in the bar is not required.                                               |
| `children`              | `ReactNode`            | Bar content.                                                                                                                             |
| `fallback`              | `ReactNode`            | Rendered behind `children` where the native effect is unavailable.                                                                       |
| `shouldAdaptToBackdrop` | `boolean`              | Report the container's `userInterfaceStyle` through `useScrollEdgeBackdropColorScheme`. Defaults to `false`.                             |
| `style`                 | `StyleProp<ViewStyle>` | Merged over the absolute positioning the component applies.                                                                              |

### `ScrollEdgeEffectProvider` / `withScrollEdgeEffectProvider`

Shares the scroll view handle. `useScrollEdgeEffectRef` throws outside a provider.

### `useScrollEdgeEffectRef()`

A ref callback for the scroll view. A `FlatList`, `SectionList` or any view containing a scroll
view works. The first scroll view found underneath is used.

### `useScrollEdgeBackdropColorScheme()`

`'light' | 'dark'` while the container's appearance differs from the device colour scheme,
otherwise `null`. Use it to recolour bar content that would otherwise clash with what scrolls
under it. Only reports under a `ScrollEdgeEffectView` with `shouldAdaptToBackdrop`.

### `isScrollEdgeEffectSupported`

Read once from native at startup. Don't substitute `Platform.Version`: an app built with an older
Xcode runs on iOS 26 with the effect compiled out.

## Requirements

- React Native 0.86 or later, **New Architecture only**. On the legacy architecture the native
  module is never registered and importing the library throws.
- Xcode 26 or later to compile the effect. Older Xcode still builds, and
  `isScrollEdgeEffectSupported` reports `false`.
- iOS 15.1 deployment target. The library does not raise your minimum.

## Contributing

See the [contributing guide](https://github.com/strollerapp/react-native-scroll-edge-effect/blob/main/CONTRIBUTING.md).

## Credits

Thanks to the Bluesky team for `expo-scroll-edge-effect`, which this started from, and to
[`@callstack/liquid-glass`](https://github.com/callstackincubator/liquid-glass) (MIT), which the
iOS 26 support check is adapted from. See
[NOTICE](https://github.com/strollerapp/react-native-scroll-edge-effect/blob/main/NOTICE).

## License

MIT
