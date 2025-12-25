
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/data';
import { UserProfile } from '../../services/firestore';
import { Colors } from '../../services/mock_api';

export default function AdminUsers() {
    const { users, toggleUserStatus } = useData();
    const router = useRouter();

    const handleToggleStatus = (item: UserProfile) => {
        toggleUserStatus(item.uid, !item.isActive);
    };

    const renderItem = ({ item }: { item: UserProfile }) => (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: 'https://ui-avatars.com/api/?name=' + item.name + '&background=random' }}
                    style={styles.avatar}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: item.role === 'admin' ? '#FF6B6B' : '#4ECDC4' }]}>
                        <Text style={styles.badgeText}>{item.role}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: item.isActive ? '#2ECC71' : '#A4B0BE' }]}>
                        <Text style={styles.badgeText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleToggleStatus(item)}
            >
                <Ionicons
                    name={item.isActive ? "ban-outline" : "checkmark-circle-outline"}
                    size={24}
                    color={item.isActive ? Colors.error : Colors.success}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Users</Text>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.uid}
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
        padding: 20,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: 20,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    email: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 6,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    actionBtn: {
        padding: 10,
    },
});
