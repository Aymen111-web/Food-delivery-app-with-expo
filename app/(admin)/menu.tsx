
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/data';
import { FoodItem } from '../../services/firestore';
import { Colors } from '../../services/mock_api';

export default function AdminMenu() {
    const { allFoods, restaurants, deleteMenuItem, updateMenuItem, addMenuItem } = useData();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // Edit/Add State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<FoodItem>>({});

    const filteredItems = allFoods.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.restaurantId && restaurants.find(r => r.id === i.restaurantId)?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getRestaurantName = (id: string) => {
        return restaurants.find(r => r.id === id)?.name || "Unknown Restaurant";
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Item",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteMenuItem(id);
                    }
                }
            ]
        );
    };

    const handleInitialAdd = () => {
        setIsEditing(false);
        setCurrentItem({
            name: '',
            price: 0,
            description: '',
            categoryId: '',
            restaurantId: restaurants.length > 0 ? restaurants[0].id : '',
            isAvailable: true
        });
        setModalVisible(true);
    };

    const handleInitialEdit = (item: FoodItem) => {
        setIsEditing(true);
        setCurrentItem({ ...item });
        setModalVisible(true);
    };

    const saveItem = async () => {
        if (!currentItem.name || !currentItem.price || !currentItem.restaurantId) {
            Alert.alert("Error", "Please fill Name, Price and select Restaurant");
            return;
        }

        try {
            if (isEditing && currentItem.id) {
                await updateMenuItem(currentItem.id, currentItem);
            } else {
                await addMenuItem(currentItem.restaurantId!, {
                    ...currentItem,
                    image: currentItem.image || 'https://via.placeholder.com/150'
                });
            }
            setModalVisible(false);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save item");
        }
    };

    const toggleAvailability = async (item: FoodItem) => {
        await updateMenuItem(item.id, { isAvailable: !item.isAvailable });
    };

    const renderItem = ({ item }: { item: FoodItem }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.restaurant}>{getRestaurantName(item.restaurantId)}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={{ color: item.isAvailable ? Colors.success : Colors.error, fontSize: 12 }}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                </Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: item.isAvailable ? Colors.warning : Colors.success }]}
                    onPress={() => toggleAvailability(item)}
                >
                    <Ionicons name={item.isAvailable ? "ban" : "checkmark"} size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => handleInitialEdit(item)}
                >
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
                <Text style={styles.headerTitle}>Manage Menu Items</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleInitialAdd}>
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

            {/* Edit/Add Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? "Edit Item" : "New Item"}</Text>
                        <ScrollView>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={currentItem.name}
                                onChangeText={t => setCurrentItem({ ...currentItem, name: t })}
                            />

                            <Text style={styles.label}>Price</Text>
                            <TextInput
                                style={styles.input}
                                value={currentItem.price?.toString()}
                                keyboardType="numeric"
                                onChangeText={t => setCurrentItem({ ...currentItem, price: parseFloat(t) || 0 })}
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={currentItem.description}
                                onChangeText={t => setCurrentItem({ ...currentItem, description: t })}
                            />

                            {/* Simple Restaurant Picker (just ID for now) */}
                            {!isEditing && (
                                <>
                                    <Text style={styles.label}>Restaurant ID (Manual for now)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentItem.restaurantId}
                                        placeholder={restaurants[0]?.id}
                                        onChangeText={t => setCurrentItem({ ...currentItem, restaurantId: t })}
                                    />
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                                        {restaurants.map(r => (
                                            <TouchableOpacity
                                                key={r.id}
                                                onPress={() => setCurrentItem({ ...currentItem, restaurantId: r.id })}
                                                style={{ padding: 5, backgroundColor: currentItem.restaurantId === r.id ? Colors.primary : '#ddd', borderRadius: 5 }}
                                            >
                                                <Text style={{ color: currentItem.restaurantId === r.id ? '#fff' : '#000', fontSize: 10 }}>{r.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            )}
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveItem} style={styles.saveModalBtn}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        alignItems: 'center'
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 10,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f9f9'
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    cancelBtn: {
        padding: 15,
    },
    cancelText: {
        color: Colors.error,
        fontWeight: 'bold'
    },
    saveModalBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
