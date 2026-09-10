import React
import UIKit

@objc(ScrollEdgeEffectViewManager)
final class ScrollEdgeEffectViewManager: RCTViewManager {
  override func view() -> UIView! {
    let view = ScrollEdgeEffectView()
    view.bridge = bridge

    return view
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
