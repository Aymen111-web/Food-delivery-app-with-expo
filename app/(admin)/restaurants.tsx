
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Restaurant, useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function AdminRestaurants() {
    const { restaurants, deleteRestaurant, addRestaurant, updateRestaurant } = useData();
    const router = useRouter();

    // Edit/Add State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState<Partial<Restaurant>>({});
    const [categoriesInput, setCategoriesInput] = useState('');

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
                    }
                }
            ]
        );
    };

    const handleInitialAdd = () => {
        setIsEditing(false);
        setCurrentRestaurant({
            name: '',
            description: '',
            categories: [],
            deliveryTime: '',
            image: 'https://via.placeholder.com/150',
            rating: 0,
            isActive: true
        });
        setCategoriesInput('');
        setModalVisible(true);
    };

    const handleInitialEdit = (item: Restaurant) => {
        setIsEditing(true);
        setCurrentRestaurant({ ...item });
        setCategoriesInput(item.categories.join(', '));
        setModalVisible(true);
    };

    const saveRestaurant = async () => {
        if (!currentRestaurant.name) {
            Alert.alert("Error", "Name is required");
            return;
        }

        const dataToSave = {
            ...currentRestaurant,
            categories: categoriesInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
        };

        try {
            if (isEditing && currentRestaurant.id) {
                await updateRestaurant(currentRestaurant.id, dataToSave);
            } else {
                await addRestaurant(dataToSave);
            }
            setModalVisible(false);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save restaurant");
        }
    };

    const toggleActive = async (item: Restaurant) => {
        await updateRestaurant(item.id, { isActive: !item.isActive });
    };

    const renderItem = ({ item }: { item: Restaurant }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.categories?.join(', ')}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating || 'N/A'}</Text>
                    <Text style={{ marginLeft: 10, fontSize: 12, color: item.isActive ? Colors.success : Colors.error }}>
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: item.isActive ? Colors.warning : Colors.success }]}
                    onPress={() => toggleActive(item)}
                >
                    <Ionicons name={item.isActive ? "ban" : "checkmark"} size={20} color="#fff" />
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
                <Text style={styles.headerTitle}>Manage Restaurants</Text>
                <TouchableOpacity style={styles.addBtn} onPress={handleInitialAdd}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
            />

            {/* Edit/Add Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? "Edit Restaurant" : "New Restaurant"}</Text>
                        <ScrollView>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={currentRestaurant.name}
                                onChangeText={t => setCurrentRestaurant({ ...currentRestaurant, name: t })}
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={currentRestaurant.description}
                                onChangeText={t => setCurrentRestaurant({ ...currentRestaurant, description: t })}
                            />

                            <Text style={styles.label}>Categories (comma separated)</Text>
                            <TextInput
                                style={styles.input}
                                value={categoriesInput}
                                onChangeText={setCategoriesInput}
                            />

                            <Text style={styles.label}>Delivery Time</Text>
                            <TextInput
                                style={styles.input}
                                value={currentRestaurant.deliveryTime}
                                onChangeText={t => setCurrentRestaurant({ ...currentRestaurant, deliveryTime: t })}
                            />

                            <Text style={styles.label}>Image URL</Text>
                            <TextInput
                                style={styles.input}
                                value={currentRestaurant.image}
                                onChangeText={t => setCurrentRestaurant({ ...currentRestaurant, image: t })}
                            />
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveRestaurant} style={styles.saveModalBtn}>
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
