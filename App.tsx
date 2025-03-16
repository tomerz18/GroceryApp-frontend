import React, { useState } from 'react';
import { Text, View, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <Button title="הוספה" onPress={addItemToList} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Keeps the content at the top
    alignItems: 'center',           // Centers the content horizontally
    marginTop: 50,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  listItem: {
    justifyContent: 'flex-end', // Aligns the content to the right
    marginVertical: 5,  // Optional for spacing between items
    width: '100%',      // Ensures the list items take up full width
    flexDirection: 'row-reverse', // Reverse order, "Remove" button will be on the left
  },
  listText: {
    fontSize: 18,
    textAlign: 'right', // Aligns text to the right within the Text component
    flex: 1, // Allow text to take remaining space
    flexWrap: 'wrap', // Allow text to wrap if it's too long
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  removeText: {
    fontSize: 16,
    color: 'red',
    marginLeft: 10,
  },
});

export default App;
