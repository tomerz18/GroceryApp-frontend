import React, { useState } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import styles from './src/styles';

const App = () => {
  const [grocery, setItem] = useState('');
  const [groceryList, setGroceryList] = useState<string[]>([]);

  const addItemToList = () => {
    if (grocery) {
      setGroceryList([...groceryList, grocery]);
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
            <Text style={styles.listText}>{item}</Text>
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
