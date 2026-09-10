#import "ScrollEdgeEffectModule.h"

@implementation ScrollEdgeEffectModule {
  facebook::react::ModuleConstants<JS::NativeScrollEdgeEffectModule::Constants> _constants;
}

- (void)initialize
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000
  if (@available(iOS 26.0, *)) {
    NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
    BOOL requiresDesignCompatibility = [infoPlist[@"UIDesignRequiresCompatibility"] boolValue];
    BOOL isContainerInteractionAvailable =
        NSClassFromString(@"UIScrollEdgeElementContainerInteraction") != nil;

    _constants = facebook::react::typedConstants<JS::NativeScrollEdgeEffectModule::Constants>({
      .isSupported = !requiresDesignCompatibility && isContainerInteractionAvailable
    });

    return;
  }
#endif

  _constants = facebook::react::typedConstants<JS::NativeScrollEdgeEffectModule::Constants>({
    .isSupported = NO
  });
}

- (facebook::react::ModuleConstants<JS::NativeScrollEdgeEffectModule::Constants>)constantsToExport
{
  return (facebook::react::ModuleConstants<JS::NativeScrollEdgeEffectModule::Constants>)[self getConstants];
}

- (facebook::react::ModuleConstants<JS::NativeScrollEdgeEffectModule::Constants>)getConstants
{
  return _constants;
}

+ (NSString *)moduleName
{
  return @"NativeScrollEdgeEffectModule";
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeScrollEdgeEffectModuleSpecJSI>(params);
}

@end
