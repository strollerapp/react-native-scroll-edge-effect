#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE (ScrollEdgeEffectViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(scrollViewTag, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(edge, NSString)
RCT_EXPORT_VIEW_PROPERTY(effectStyle, NSString)

@end
