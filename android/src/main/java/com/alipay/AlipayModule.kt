package com.alipay

import com.alipay.sdk.app.PayTask
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import java.util.concurrent.Executors

@ReactModule(name = AlipayModule.NAME)
class AlipayModule(reactContext: ReactApplicationContext) :
  NativeAlipaySpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  override fun pay(orderInfo: String, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
        val errorMap = Arguments.createMap()
        errorMap.putString("resultStatus", "4000")
        errorMap.putString("result", "")
        errorMap.putString("memo", "No activity found")
        promise.resolve(errorMap)
        return
    }

    // 在子线程中调用支付接口
    Executors.newSingleThreadExecutor().execute {
        try {
            val payTask = PayTask(activity)
            val result = payTask.payV2(orderInfo, true)
            
            // 解析支付结果
            val resultMap = Arguments.createMap()
            val resultStatus = result["resultStatus"]
            val resultData = result["result"] ?: ""
            val memo = result["memo"] ?: ""
            
            resultMap.putString("resultStatus", resultStatus)
            resultMap.putString("result", resultData)
            resultMap.putString("memo", memo)
            
            promise.resolve(resultMap)
        } catch (e: Exception) {
            val errorMap = Arguments.createMap()
            errorMap.putString("resultStatus", "4000")
            errorMap.putString("result", "")
            errorMap.putString("memo", e.message ?: "Unknown error")
            promise.resolve(errorMap)
        }
    }
  }

  override fun setScheme(scheme: String) {
    // TODO: Implement scheme setting logic if needed
  }

  companion object {
    const val NAME = "Alipay"
  }
}
