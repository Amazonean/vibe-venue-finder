import React from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { supabase } from './src/lib/supabase';

const qc = new QueryClient();

function VenuesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')              // make sure you have a "venues" table in Supabase
        .select('id,name,city')
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <ActivityIndicator style={{ marginTop: 24 }} />;
  if (error) return <Text style={styles.error}>Error: {(error as Error).message}</Text>;
  if (!data?.length) return <Text style={styles.empty}>No venues yet. Add some in Supabase.</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => String(item.id)}
      renderItem={({ item }: any) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          {item.city ? <Text style={styles.city}>{item.city}</Text> : null}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Arvenu — Nearby Venues</Text>
        <VenuesList />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  title: { color: 'white', fontSize: 22, fontWeight: '700', padding: 16 },
  row: { paddingVertical: 10 },
  name: { color: 'white', fontSize: 18, fontWeight: '600' },
  city: { color: '#9aa0a6', marginTop: 2 },
  sep: { height: 1, backgroundColor: '#1f1f1f' },
  empty: { color: '#9aa0a6', padding: 16 },
  error: { color: '#ff6666', padding: 16 },
});
