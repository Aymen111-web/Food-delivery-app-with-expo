import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function AdminMenu() {
    const { restaurants, deleteMenuItem, addMenuItem } = useData();
    // Flatten all menu items for demo purposes, including restaurantId
    const allItems = restaurants.flatMap(r => r.menu.map(m => ({ ...m, restaurant: r.name, restaurantId: r.id })));

    // In a real app we might filter locally, but for now we derive from 'restaurants' which changes.
    // However, if we put 'allItems' in state, it won't update when 'restaurants' updates unless we use useEffect or just derive it on render.
    // Deriving on render is safer for small lists.

    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleDelete = (restaurantId: string, itemId: string, name: string) => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteMenuItem(restaurantId, itemId);
                        Alert.alert("Success", "Item deleted");
                    }
                }
            ]
        );
    };

    const handleAdd = () => {
        if (restaurants.length === 0) {
            Alert.alert("Error", "No restaurants available to add menu items to.");
            return;
        }
        // Add to the first restaurant for demo
        addMenuItem(restaurants[0].id, {
            name: "New Menu Item " + Math.floor(Math.random() * 100),
            price: 9.99,
            description: "Freshly added item",
            category: "New"
        });
        Alert.alert("Success", `Added item to ${restaurants[0].name}`);
    };

    const toggleAvailability = (id: string) => {
        // Toggle logic if we had it in context
        Alert.alert("Info", "Availability toggle not fully implemented in context yet");
    };

    const filteredItems = allItems.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: typeof allItems[0] }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.restaurant}>{item.restaurant}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: Colors.success }]}
                    onPress={() => toggleAvailability(item.id)}
                >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item.restaurantId, item.id, item.name)}
                >
                    <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Menu Items</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    addBtn: {
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        margin: 20,
        marginBottom: 10,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        flexDirection: 'row',
        padding: 15,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    restaurant: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtn: {
        backgroundColor: Colors.secondary,
    },
    deleteBtn: {
        backgroundColor: Colors.error,
    },
});
