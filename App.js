/* eslint-disable react-native/no-inline-styles */
import '@ethersproject/shims';
import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const ethers = require('ethers');

const INFURA_ID = '669666b87f0d4f5f8b4fc57954cc0503';
const INFURA_KEY = 'e8b5b22daa1040ce9fc9cc7fde65c7bf';
const ACCOUNT_KEY =
  '411d1e0aeb179a2c805699cb15909689ea1a7aaf2cce10a2bda257ae47051b36';

const network = 'sepolia';

function Section({children, title}) {
  const isDarkMode = true;
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const App = () => {
  const isDarkMode = true;
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const [statusText, setStatusText] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const checkStatus = txhash => {
    const url = `https://${network}.infura.io/v3/${INFURA_ID}`;
    const data = {
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [`${txhash}`],
      id: 1,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(status => {
        if (status.result !== null) {
          setStatusText('status: Transaction Success!');
        } else {
          setStatusText('status: Transcation is processing');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onSumbitPress = async () => {
    setStatusText('status: Transaction Initiated.');

    const provider = new ethers.providers.InfuraProvider(network, {
      projectId: INFURA_ID,
      projectSecret: INFURA_KEY,
    });

    const signer = new ethers.Wallet(ACCOUNT_KEY, provider);

    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseUnits(amount, 'ether'),
      gasPrice: 100000,
    });

    setStatusText('status: Mining transaction.');

    const receipt = await tx.wait();

    setTo('');
    setAmount('0');
    checkStatus(receipt.transactionHash);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Section title="Welcome to Cryptoxpress">
              <Text>
                Please enter the address of the recipient and the amount to
                transfer.
              </Text>
            </Section>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize: 18, marginBottom: 8}}>
              Enter Transaction Amount:
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={{
                borderColor: 'gray',
                borderWidth: 1,
                paddingHorizontal: 8,
              }}
              placeholder="Amount in ETH"
            />
            <Text style={{fontSize: 18, marginBottom: 8, marginTop: 16}}>
              Enter Recipient Address:
            </Text>
            <TextInput
              value={to}
              onChangeText={setTo}
              style={{
                borderColor: 'gray',
                borderWidth: 1,
                paddingHorizontal: 8,
                marginBottom: 32,
              }}
              placeholder="To Address (0x...)"
            />
            {statusText ? (
              <Text style={{color: 'white', marginBottom: 16}}>
                {statusText}
              </Text>
            ) : null}
            <Button title={'Submit'} onPress={onSumbitPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
