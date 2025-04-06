import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from './src/styles';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'https://mznq30wkg3.execute-api.us-east-1.amazonaws.com';

interface GroceryItem {
  name: string;
}

const App = () => {
  const [grocery, setItem] = useState('');
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const getGroceryItems = async (): Promise<GroceryItem[]> => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      console.log('Get items response:');
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch grocery items:', error);
      throw error;
    }
  };

  const addItem = async (item: GroceryItem) => {
    try {
      const response = await axios.post(`${API_URL}/items`, item);
      console.log('Add item response:');
      console.log(response);

      return response.status;
    } catch (error) {
      console.error('Failed to add grocery item:', error);
      Alert.alert('Error', 'Failed to add grocery item');
      throw error;
    }
  };

  const removeItem = async (item: GroceryItem) => {
    try {
      const response = await axios.delete(`${API_URL}/items/${item.name}`);
      console.log('Delete item response:');
      console.log(response);

      return response.status;
    } catch (error) {
      console.error('Failed to delete grocery item:', error);
      Alert.alert('Error', 'Failed to delete grocery item');
      throw error;
    }
  };

    // Fetch grocery items when the app loads
    useEffect(() => {
      fetchGroceryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const fetchGroceryItems = async () => {
    try {
      setIsLoading(true);

      const items = await getGroceryItems();
      setGroceryList(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load grocery items');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToList = async () => {
    if (grocery) {
      let groceryItem: GroceryItem = { name: grocery.trim() };
      let status = await addItem(groceryItem);

      if (status !== 201) {
        Alert.alert('Error', 'Failed to add grocery item');
      } else {
        fetchGroceryItems();
      }
      setItem('');

    }
  };

  const removeItemFromList = async (item: GroceryItem) => {
    let status = await removeItem(item);
    if (status !== 200) {
      Alert.alert('Error', 'Failed to add grocery item');
    } else {
      fetchGroceryItems();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={fetchGroceryItems}
        disabled={isLoading}
      >
        <Text style={styles.refreshButtonText}>↻</Text>
      </TouchableOpacity>
      <Text style={styles.title}>רשימת קניות</Text>

      <TextInput
        style={styles.input}
        value={grocery}
        onChangeText={setItem}
        placeholder="הכנס מוצר"
      />

      <TouchableOpacity style={styles.button} onPress={addItemToList}>
        <Text style={styles.buttonText}>הוספה</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>טוען רשימה...</Text>
        </View>
      ) : (
          <FlatList
            data={groceryList}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listText}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeItemFromList(item)}>
                  <Text style={styles.removeText}>הסר</Text>
                </TouchableOpacity>
              </View>
            )}
          />
      )}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Version {DeviceInfo.getVersion()}
        </Text>
      </View>
    </View>
  );
};

export default App;
