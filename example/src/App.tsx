import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { pay ,setScheme as setSchemeNative} from 'react-native-alipay';

export default function App() {
  const [orderStr, setOrderStr] = useState('timestamp=2025-04-27+18%3A25%3A39&app_id=2021004151692165&method=alipay.trade.app.pay&charset=utf-8&format=json&version=1.0&sign_type=RSA2&notify_url=https%3A%2F%2Fwww.baidu.com&sign=bxVvag7QB1nDy%2BT1wNvMgkhRP3cf6TGvArXfSDWQeLQNiMMo4%2FNfKapcl%2BEKj59Nc13JEjwelXkvyWvhq9WcfoHcSopg6HDIkA%2BslV%2Buos01wCB4wPnq6yZizLnRD9wofwUKtrV46kITLpGmXBMFJc%2FQyw1whiHnCjAEsCxTLXq7xW%2BHF%2FPaxe5bOvnGBmeCm6mBk1Hphelg8waSY%2FkvqCbaJS0SecNNXhch0XIrpiy2%2FtqvbJFpG83B%2FKM64IZ7v9T4%2FMdplj1f1l2sRK6M%2FuSRK1HGqs9SJJQ1qooYdxIDMe%2BzdVQgCjFyPgHjeLqH0a0tPWbRzFZqCnfWYp5lVg%3D%3D&biz_content=%7B%22out_trade_no%22%3A%221234567890%22%2C%22subject%22%3A%22%E8%AE%A2%E5%8D%95%E6%94%AF%E4%BB%98%22%2C%22total_amount%22%3A1%7D');
  const [payResult, setPayResult] = useState<string>('');
  const [scheme, setScheme] = useState('AlipayExample');

  const handlePay = async () => {
    try {
      console.log("start pay")
      const result = await pay(orderStr);
      setPayResult(JSON.stringify(result, null, 2));
      console.log('result', result);
    } catch (error) {
      setPayResult(`支付错误: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>支付宝支付测试</Text>
        <Text style={styles.label}>scheme:</Text>
        <TextInput
          style={styles.input}
          value={scheme}
          onChangeText={setScheme}
          placeholder="请输入scheme"
        />
        <TouchableOpacity style={styles.button} onPress={() =>  setSchemeNative(scheme)}>
          <Text style={styles.buttonText}>设置scheme</Text>
        </TouchableOpacity>
        <Text style={styles.label}>订单信息:</Text>
        <TextInput
          style={styles.input}
          value={orderStr}
          onChangeText={setOrderStr}
          placeholder="请输入订单信息"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handlePay}>
          <Text style={styles.buttonText}>发起支付</Text>
        </TouchableOpacity>

        <Text style={styles.label}>支付结果:</Text>
        <Text style={styles.result}>{payResult}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1677FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
  },
});
