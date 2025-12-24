import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function AdminRestaurants() {
    const { restaurants, deleteRestaurant, addRestaurant } = useData();
    const router = useRouter();

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Restaurant",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteRestaurant(id);
                        Alert.alert("Success", "Restaurant deleted");
                    }
                }
            ]
        );
    };

    const handleAdd = () => {
        addRestaurant({
            name: "New Restaurant " + Math.floor(Math.random() * 100),
            rating: 4.5,
            categories: ["New"],
            deliveryTime: "30-45 min",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
            menu: []
        });
    };

    const renderItem = ({ item }: { item: typeof restaurants[0] }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.categories.join(', ')}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item.id, item.name)}
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
                <Text style={styles.headerTitle}>Manage Restaurants</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={restaurants}
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
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        flexDirection: 'row',
        padding: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    meta: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FBC02D',
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
