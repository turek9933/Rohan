import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { importTask } from '@/utils/importTask';
import { Task } from '@/utils/Task';

export default function ImportScreen() {
  const [importedTasks, setImportedTasks] = useState<Task[]>([]);

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/markdown',
      });
      
      if (result.canceled) return;
  
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const tasks = await importTask(uri);
        console.log('Imported tasks:', tasks);
        setImportedTasks(tasks);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing file!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Button title="Import MD File" onPress={handleImport} />
      
      {importedTasks.map((task, index) => (
        <View key={index} style={styles.taskCard}>
          <Text style={styles.title}>{task.title}</Text>
          <Text>Description: {task.description}</Text>
          <Text>Status: {task.metadata.status ? '✅' : '❌'}</Text>
          <Text>Start: {task.metadata.startDate?.toISOString().split('T')[0] || 'Not set'}</Text>
          <Text>Deadline: {task.metadata.deadline?.toISOString().split('T')[0] || 'Not set'}</Text>
          <Text>Reward: {task.metadata.reward} points</Text>
          
          <Text style={styles.subtitle}>Subtasks:</Text>
          {task.subtasks?.map((subtask, i) => (
            <Text key={i}>
              {subtask.completed ? '✓' : '◻'} {subtask.title}
            </Text>
          ))}
          
          <Text style={styles.subtitle}>Attachments:</Text>
          {task.attachments?.map((attachment, i) => (
            <Text key={i} style={styles.attachment}>
              {attachment.type.toUpperCase()}: {attachment.altText || 'File'} - {attachment.path}
              <Image source={{ uri: attachment.path }} style={{ width: 50, height: 50 }} />
            </Text>
          ))}
          <Text style={styles.subtitle}>Image:</Text>
          <Image source={{ uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdb.hauff-technik.de%2Fimages%2Fcache%2F567%2F101%2FP1_GFH20_PRO.JPG.1920.jpg&f=1&nofb=1&ipt=34379e4b1f6b26588a2cf408ac5318100740762e42f8475aa03838de4cd949c9' }} style={{ width: 50, height: 50 }} />
          <Text style={styles.subtitle}>Image:</Text>
          <Image source={{ uri: 'C:\\Users\\tture\\Downloads\\asd.png' }} style={{ width: 50, height: 50 }} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  attachment: {
    color: '#666',
    fontSize: 12,
  },
});