
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/data';
import { Category } from '../../services/firestore';
import { Colors } from '../../services/mock_api';

export default function AdminCategories() {
    const { categories, addCategory, deleteCategory, updateCategory } = useData();
    const router = useRouter();
    const [newCategory, setNewCategory] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteCategory(id);
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        if (!newCategory.trim()) return;

        if (editingCategory) {
            await updateCategory(editingCategory.id, newCategory);
            setEditingCategory(null);
        } else {
            await addCategory(newCategory);
        }

        setNewCategory('');
        setIsAdding(false);
    };

    const startEdit = (item: Category) => {
        setNewCategory(item.name);
        setEditingCategory(item);
        setIsAdding(true);
    };

    const cancelEdit = () => {
        setNewCategory('');
        setEditingCategory(null);
        setIsAdding(false);
    };

    const renderItem = ({ item }: { item: Category }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <View style={styles.iconBox}>
                    <Ionicons name="fast-food" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.name}>{item.name}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => startEdit(item)}
                >
                    <Ionicons name="pencil" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item.id, item.name)}
                >
                    <Ionicons name="trash" size={18} color="#fff" />
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
                <Text style={styles.headerTitle}>Manage Categories</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    if (isAdding) cancelEdit();
                    else setIsAdding(true);
                }}>
                    <Ionicons name={isAdding ? "close" : "add"} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {isAdding && (
                <View style={styles.addContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={editingCategory ? "Edit Category Name" : "New Category Name"}
                        value={newCategory}
                        onChangeText={setNewCategory}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>{editingCategory ? "Update" : "Save"}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={categories}
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
    addContainer: {
        padding: 20,
        backgroundColor: Colors.card,
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
    },
    saveBtn: {
        backgroundColor: Colors.success,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        flexDirection: 'row',
        padding: 15,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
