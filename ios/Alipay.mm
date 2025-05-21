#import "Alipay.h"
#import <AlipaySDK/AlipaySDK.h>

static NSString *_appScheme = nil;

@interface Alipay ()
@property (nonatomic, copy) RCTPromiseResolveBlock payOrderResolve;
@end

@implementation Alipay
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
        // 可选：启用支付宝SDK日志
        // [AlipaySDK startLogWithBlock:^(NSString* log){
        //      NSLog(@"%@", log);
        // }];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (BOOL)handleOpenURL:(NSNotification *)aNotification
{
    NSString *aURLString = [aNotification userInfo][@"url"];
    NSURL *aURL = [NSURL URLWithString:aURLString];
    NSLog(@"handleOpenURL: %@",aURLString);//
    if ([aURL.host isEqualToString:@"safepay"]) {
        __weak __typeof__(self) weakSelf = self;
        // 处理支付宝支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:aURL standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"payment result = %@", resultDic);
            if (weakSelf.payOrderResolve) {
                weakSelf.payOrderResolve(resultDic);
                weakSelf.payOrderResolve = nil;
            }
        }];
    }
    
    if ([aURL.host isEqualToString:@"platformapi"]) {
        // 处理支付宝授权结果
        [[AlipaySDK defaultService] processAuthResult:aURL standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"auth result = %@", resultDic);
            // 可以添加额外的授权处理逻辑
        }];
    }
    
    return NO;
}

// Add the pay method implementation here
//- (void)pay:(NSString *)orderInfo resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
//    // TODO: Implement Alipay SDK payment logic here
//    
//    // Example response format matching Android implementation
//    NSMutableDictionary *resultMap = [NSMutableDictionary dictionary];
//    
//    // These values should be replaced with actual values from Alipay SDK response
//    [resultMap setObject:@"9000" forKey:@"resultStatus"]; // 9000 is success in Alipay
//    [resultMap setObject:@"" forKey:@"result"];           // Result string from Alipay
//    [resultMap setObject:@"Payment successful" forKey:@"memo"]; // Message
//    
//    resolve(resultMap);
//    
//    // In case of error, use:
//    // reject(@"payment_error", @"Payment failed", error);
//}

- (void)pay:(NSString *)orderInfo resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    // 立即存储 resolve 回调（线程安全）
    self.payOrderResolve = resolve;

    NSString *scheme = _appScheme ?: @"zhikeonline";

    __weak Alipay *weakSelf = self; // 用类名替代 typeof(self)
    dispatch_async(dispatch_get_main_queue(), ^{
        [[AlipaySDK defaultService] payOrder:orderInfo fromScheme:scheme callback:^(NSDictionary *resultDic) {
            NSLog(@"payOrder callback result = %@", resultDic);
            if (weakSelf && weakSelf.payOrderResolve) {
                weakSelf.payOrderResolve(resultDic);
                weakSelf.payOrderResolve = nil;
            }
        }];
    });
}



- (void)setScheme:(NSString *)scheme {
    // Store the scheme globally for later use in the pay method
    if (scheme && scheme.length > 0) {
        _appScheme = [scheme copy];
        NSLog(@"Scheme set to: %@", _appScheme);
    } else {
        NSLog(@"Warning: attempted to set empty scheme");
    }
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}


- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAlipaySpecJSI>(params);
}

@end
