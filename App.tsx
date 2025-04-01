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
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Failed to fetch grocery items:', error);
      throw error;
    }
  };

    // Fetch grocery items when the app loads
    useEffect(() => {
      fetchGroceryItems();
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

  const addItemToList = () => {
    if (grocery) {
      setGroceryList([...groceryList, { name: grocery }]);
      setItem(''); // Clear input field after adding
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
