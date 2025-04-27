import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider



@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "AlipayExample"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    
    let notificationName = NSNotification.Name("RCTOpenURLNotification")
    NotificationCenter.default.post(name: notificationName, object: nil, userInfo: ["url": url.absoluteString])
    
    if url.host == "safepay" {
        // 支付跳转支付宝钱包进行支付，处理支付结果
      AlipaySDK.defaultService().processOrder(withPaymentResult: url, standbyCallback: { resultDic in
            print("result = \(String(describing: resultDic))")
        })
        return true
    }
    
    // 增加处理授权结果的代码
    if url.host == "platformapi" {
        // 支付宝钱包快登授权返回authCode
        AlipaySDK.defaultService().processAuthResult(url, standbyCallback: { resultDic in
            print("auth result = \(String(describing: resultDic))")
        })
        return true
    }
    
    return false
  }



}
