import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { pay } from 'react-native-alipay';

export default function App() {
  const [orderStr, setOrderStr] = useState('');
  const [payResult, setPayResult] = useState<string>('');

  const handlePay = async () => {
    try {
      const result = await pay(orderStr);
      setPayResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setPayResult(`支付错误: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>支付宝支付测试</Text>
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
