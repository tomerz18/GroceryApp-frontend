import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './src/styles';
import axios from 'axios';

const API_URL = 'https://mznq30wkg3.execute-api.us-east-1.amazonaws.com';

interface GroceryItem {
  name: string;
}

const App = () => {
  const [grocery, setItem] = useState('');
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);


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

  const AddItem = async (item: GroceryItem) => {
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

    // Fetch grocery items when the app loads
    useEffect(() => {
      fetchGroceryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const fetchGroceryItems = async () => {
    try {
      const items = await getGroceryItems();
      setGroceryList(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load grocery items');
      console.error(error);
    }
  };

  const addItemToList = async () => {
    if (grocery) {
      let groceryItem: GroceryItem = { name: grocery };
      let status = await AddItem(groceryItem);

      if (status !== 201) {
        Alert.alert('Error', 'Failed to add grocery item');
      } else {
        fetchGroceryItems();
      }
      setItem('');

    }
  };

  const removeItemFromList = (index: number) => {
    setGroceryList(groceryList.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
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

      <FlatList
        data={groceryList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeItemFromList(index)}>
              <Text style={styles.removeText}>הסר</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default App;
