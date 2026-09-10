import React
import UIKit

private enum ScrollEdge: String {
  case top
  case bottom

  var uiRectEdge: UIRectEdge {
    switch self {
    case .top:
      return .top
    case .bottom:
      return .bottom
    }
  }
}

@objc(ScrollEdgeEffectView)
final class ScrollEdgeEffectView: RCTView {
  private static let maxResolveAttempts = 30
  private static let retryDelay: TimeInterval = 0.1

  private struct InteractionKey: Hashable {
    let scrollViewID: ObjectIdentifier
    let edge: ScrollEdge
  }

  private static var activeInteractions: Set<InteractionKey> = []

  private var appliedInteraction: UIInteraction?
  private var retryWorkItem: DispatchWorkItem?
  private var shapeElementView: UILabel?

  private var previousEdgeEffectStyle: NSObject?
  private var appliedEdgeEffectStyle: NSObject?
  private var registeredInteractionKey: InteractionKey?
  private var hasResolvedTarget = false
  private var hasReportedContention = false
  private var traitObserverRegistration: NSObjectProtocol?
  private var lastReportedColorScheme: String?
  private var resolveAttempts = 0
  private var attachedTargetViewTag: Int?
  private var attachedEdge: ScrollEdge?
  private weak var attachedScrollView: UIScrollView?

  weak var bridge: RCTBridge?

  deinit {
    guard let registeredInteractionKey else {
      return
    }

    DispatchQueue.main.async {
      Self.activeInteractions.remove(registeredInteractionKey)
    }
  }

  @objc var scrollViewTag: NSNumber? {
    didSet {
      if scrollViewTag == oldValue {
        return
      }

      detach()
      restartResolving()
    }
  }

  @objc var edge: NSString = "top" {
    didSet {
      if edge == oldValue {
        return
      }

      detach()
      restartResolving()
    }
  }

  @objc var onAppearanceChange: RCTDirectEventBlock?

  override func didMoveToWindow() {
    super.didMoveToWindow()

    if window == nil {
      detach()

      return
    }

    restartResolving()
  }

  override func layoutSubviews() {
    super.layoutSubviews()

    shapeElementView?.frame = bounds

    if window == nil {
      return
    }

    if isCurrentAttachmentValid() {
      reassertEdgeEffectStyle()

      return
    }

    if resolveAttempts >= Self.maxResolveAttempts {
      return
    }

    attach()
  }

  private var isEdgeEffectSupported: Bool {
    #if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      return true
    }
    #endif

    return false
  }

  private var isReadyToAttach: Bool {
    window != nil && bounds.height > 0
  }

  private var requestedEdge: ScrollEdge {
    return ScrollEdge(rawValue: edge as String) ?? .top
  }

  private func restartResolving() {
    if isCurrentAttachmentValid() {
      return
    }

    cancelRetry()
    resolveAttempts = 0
    hasReportedContention = false

    attach()
  }

  private func isCurrentAttachmentValid() -> Bool {
    guard hasResolvedTarget, window != nil else {
      return false
    }

    guard attachedTargetViewTag == scrollViewTag?.intValue,
      attachedEdge == requestedEdge
    else {
      return false
    }

    guard let attachedScrollView, attachedScrollView.window === window else {
      return false
    }

    return true
  }

  private func attach() {
    guard isEdgeEffectSupported, isReadyToAttach,
      let scrollViewTag
    else {
      return
    }

    guard let scrollView = findScrollView(withTag: scrollViewTag) else {
      if hasResolvedTarget {
        detach()
      }

      handleUnresolvedTarget(withTag: scrollViewTag)

      return
    }

    let requestedEdge = requestedEdge

    if hasResolvedTarget, attachedScrollView === scrollView, attachedEdge == requestedEdge {
      rememberAttachment(
        to: scrollView,
        targetViewTag: scrollViewTag.intValue,
        edge: requestedEdge
      )
      reassertEdgeEffectStyle()

      return
    }

    detach()

    let interactionKey = InteractionKey(
      scrollViewID: ObjectIdentifier(scrollView),
      edge: requestedEdge
    )

    guard Self.registerInteraction(interactionKey) else {
      handleContendedInteraction(interactionKey)

      return
    }

    rememberAttachment(
      to: scrollView,
      targetViewTag: scrollViewTag.intValue,
      edge: requestedEdge
    )
    registeredInteractionKey = interactionKey
    ensureShapeElement()
    applySoftEdgeEffectStyle(to: scrollView, edge: requestedEdge)
    addScrollEdgeContainerInteraction(for: scrollView, edge: requestedEdge)
    registerTraitObserverIfNeeded()
  }

  private func detach() {
    cancelRetry()
    restorePreviousEdgeEffectStyle()
    removeScrollEdgeContainerInteraction()
    removeShapeElement()
    unregisterTraitObserver()
    releaseInteractionKey()
    forgetAttachment()
  }

  private static func registerInteraction(_ key: InteractionKey) -> Bool {
    return activeInteractions.insert(key).inserted
  }

  private func releaseInteractionKey() {
    guard let registeredInteractionKey else {
      return
    }

    self.registeredInteractionKey = nil
    Self.activeInteractions.remove(registeredInteractionKey)
  }

  private func handleUnresolvedTarget(withTag tag: NSNumber) {
    if retryWorkItem != nil {
      return
    }

    resolveAttempts += 1

    if resolveAttempts < Self.maxResolveAttempts {
      scheduleRetry()

      return
    }

    logUnresolvedTarget(withTag: tag)
  }

  private func handleContendedInteraction(_ key: InteractionKey) {
    if hasReportedContention {
      return
    }

    hasReportedContention = true

    logContendedInteraction(key)
  }

  private func logUnresolvedTarget(withTag tag: NSNumber) {
    #if DEBUG
      NSLog(
        "%@",
        "[ScrollEdgeEffect] Could not resolve a scroll view with React tag"
          + " \"\(tag)\" after \(Self.maxResolveAttempts) attempts."
      )
    #endif
  }

  private func logContendedInteraction(_ key: InteractionKey) {
    #if DEBUG
      NSLog(
        "%@",
        "[ScrollEdgeEffect] Another \(key.edge.rawValue) edge effect is"
          + " already attached to this scroll view."
      )
    #endif
  }

  private func registerTraitObserverIfNeeded() {
    #if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }

    emitAppearanceChange(force: true)

    if traitObserverRegistration != nil {
      return
    }

    traitObserverRegistration = registerForTraitChanges([UITraitUserInterfaceStyle.self]) {
      (view: ScrollEdgeEffectView, _: UITraitCollection) in
      view.emitAppearanceChange(force: false)
    }
    #endif
  }

  private func unregisterTraitObserver() {
    #if compiler(>=6.2)
    guard #available(iOS 26.0, *),
      let registration = traitObserverRegistration as? UITraitChangeRegistration
    else {
      return
    }

    traitObserverRegistration = nil
    unregisterForTraitChanges(registration)
    #endif
  }

  private func emitAppearanceChange(force: Bool) {
    guard let colorScheme = colorSchemeName(traitCollection.userInterfaceStyle)
    else {
      return
    }

    if !force, colorScheme == lastReportedColorScheme {
      return
    }

    lastReportedColorScheme = colorScheme

    logAppearanceChange(colorScheme)

    onAppearanceChange?([
      "colorScheme": colorScheme
    ])
  }

  private func colorSchemeName(_ style: UIUserInterfaceStyle) -> String? {
    switch style {
    case .light:
      return "light"
    case .dark:
      return "dark"
    default:
      return nil
    }
  }

  private func logAppearanceChange(_ colorScheme: String) {
    #if DEBUG
      NSLog(
        "%@",
        "[ScrollEdgeEffect] colorScheme=\(colorScheme)"
          + " edge=\(requestedEdge.rawValue)"
      )
    #endif
  }

  private func scheduleRetry() {
    if retryWorkItem != nil {
      return
    }

    let workItem = DispatchWorkItem { [weak self] in
      guard let self else {
        return
      }

      self.retryWorkItem = nil

      if self.window == nil || self.isCurrentAttachmentValid() {
        return
      }

      self.attach()
    }

    retryWorkItem = workItem
    DispatchQueue.main.asyncAfter(
      deadline: .now() + Self.retryDelay,
      execute: workItem
    )
  }

  private func cancelRetry() {
    retryWorkItem?.cancel()
    retryWorkItem = nil
  }

  private func rememberAttachment(
    to scrollView: UIScrollView,
    targetViewTag: Int,
    edge: ScrollEdge
  ) {
    hasResolvedTarget = true
    resolveAttempts = 0
    attachedTargetViewTag = targetViewTag
    attachedEdge = edge
    attachedScrollView = scrollView
  }

  private func forgetAttachment() {
    hasResolvedTarget = false
    attachedTargetViewTag = nil
    attachedEdge = nil
    attachedScrollView = nil
  }

  private func applySoftEdgeEffectStyle(to scrollView: UIScrollView, edge: ScrollEdge) {
    #if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }

    previousEdgeEffectStyle = edgeEffectStyle(from: scrollView, edge: edge)

    let appliedStyle = UIScrollEdgeEffect.Style.soft

    setEdgeEffectStyle(appliedStyle, on: scrollView, edge: edge)

    appliedEdgeEffectStyle = appliedStyle
    #endif
  }

  private func ensureShapeElement() {
    if shapeElementView != nil {
      return
    }

    let label = UILabel()
    label.isUserInteractionEnabled = false
    label.isAccessibilityElement = false
    label.backgroundColor = .clear
    label.frame = bounds

    insertSubview(label, at: 0)

    shapeElementView = label
  }

  private func removeShapeElement() {
    shapeElementView?.removeFromSuperview()
    shapeElementView = nil
  }

  private func restorePreviousEdgeEffectStyle() {
    defer {
      previousEdgeEffectStyle = nil
      appliedEdgeEffectStyle = nil
    }

    #if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }

    guard let attachedScrollView,
      let attachedEdge,
      let previousStyle = previousEdgeEffectStyle as? UIScrollEdgeEffect.Style,
      let appliedStyle = appliedEdgeEffectStyle as? UIScrollEdgeEffect.Style,
      edgeEffectStyle(from: attachedScrollView, edge: attachedEdge) === appliedStyle
    else {
      return
    }

    setEdgeEffectStyle(previousStyle, on: attachedScrollView, edge: attachedEdge)
    #endif
  }

  private func reassertEdgeEffectStyle() {
    #if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }

    guard let attachedScrollView,
      let attachedEdge,
      let appliedStyle = appliedEdgeEffectStyle as? UIScrollEdgeEffect.Style,
      edgeEffectStyle(from: attachedScrollView, edge: attachedEdge) !== appliedStyle
    else {
      return
    }

    setEdgeEffectStyle(appliedStyle, on: attachedScrollView, edge: attachedEdge)
    #endif
  }

  #if compiler(>=6.2)
  @available(iOS 26.0, *)
  private func edgeEffectStyle(
    from scrollView: UIScrollView,
    edge: ScrollEdge
  ) -> UIScrollEdgeEffect.Style {
    switch edge {
    case .top:
      return scrollView.topEdgeEffect.style
    case .bottom:
      return scrollView.bottomEdgeEffect.style
    }
  }

  @available(iOS 26.0, *)
  private func setEdgeEffectStyle(
    _ style: UIScrollEdgeEffect.Style,
    on scrollView: UIScrollView,
    edge: ScrollEdge
  ) {
    switch edge {
    case .top:
      scrollView.topEdgeEffect.style = style
    case .bottom:
      scrollView.bottomEdgeEffect.style = style
    }
  }
  #endif

  private func addScrollEdgeContainerInteraction(
    for scrollView: UIScrollView,
    edge: ScrollEdge
  ) {
    #if compiler(>=6.2)
    guard #available(iOS 26.0, *) else {
      return
    }

    let interaction = UIScrollEdgeElementContainerInteraction()

    interaction.scrollView = scrollView
    interaction.edge = edge.uiRectEdge

    addInteraction(interaction)

    appliedInteraction = interaction
    #endif
  }

  private func removeScrollEdgeContainerInteraction() {
    if let interaction = appliedInteraction {
      removeInteraction(interaction)
    }

    appliedInteraction = nil
  }

  private func findScrollView(withTag tag: NSNumber) -> UIScrollView? {
    guard let container = bridge?.uiManager.view(forReactTag: tag) else {
      return nil
    }

    if let scrollView = container as? UIScrollView {
      return scrollView
    }

    return Self.findFirstScrollView(in: container)
  }

  private static func findFirstScrollView(in view: UIView) -> UIScrollView? {
    for subview in view.subviews {
      if let scrollView = subview as? UIScrollView {
        return scrollView
      }

      if let found = findFirstScrollView(in: subview) {
        return found
      }
    }

    return nil
  }
}
