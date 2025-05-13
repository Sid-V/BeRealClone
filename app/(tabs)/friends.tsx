import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
};

export default function FriendsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const formattedContacts = data
            .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0 && contact.id)
            .map(contact => ({
              id: contact.id!,
              name: contact.name || 'Unknown',
              phoneNumber: contact.phoneNumbers![0].number || '',
            }))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); // Case-insensitive sort
          setContacts(formattedContacts);
        }
      }
      setLoading(false);
    })();
  }, []);

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactItem}>
      <ThemedView style={styles.avatar}>
        <ThemedText style={styles.avatarText}>
          {item.name[0].toUpperCase()}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.contactInfo}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText style={styles.phoneNumber}>{item.phoneNumber}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading contacts...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Find Friends
      </ThemedText>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  phoneNumber: {
    color: '#666',
    marginTop: 2,
  },
});
