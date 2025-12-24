
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { Colors } from '../../services/mock_api';

export default function ProfileScreen() {
    const { user, signOut, updateProfile } = useAuth();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: signOut }
            ]
        );
    };

    const handleUpdate = async () => {
        await updateProfile({ name, phone, address });
        setModalVisible(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const openModal = () => {
        setName(user?.name || '');
        setPhone(user?.phone || '');
        setAddress(user?.address || '');
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=' + user?.name + '&background=random&size=200' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={openModal}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="person-outline" size={22} color={Colors.text} />
                            <Text style={styles.menuItemText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="location-outline" size={22} color={Colors.text} />
                            <Text style={styles.menuItemText}>Saved Addresses</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    {/* ... other items ... */}
                </View>

                {/* ... App Settings ... */}

                <View style={styles.section}>
                    {/* ... */}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} />

                        <Text style={styles.label}>Phone</Text>
                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+1 234..." />

                        <Text style={styles.label}>Address</Text>
                        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Main St..." />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleUpdate}>
                                <Text style={[styles.btnText, { color: '#fff' }]}>Save</Text>
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
        padding: 20,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: Colors.textLight,
        marginBottom: 10,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: Colors.primary + '20', // 20% opacity
        borderRadius: 12,
    },
    roleText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
        marginLeft: 5,
    },
    menuItem: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 3,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: Colors.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    version: {
        textAlign: 'center',
        marginTop: 30,
        color: Colors.textLight,
        fontSize: 12,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20
    },
    modalContent: {
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 20,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
        color: Colors.text
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    btn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5
    },
    cancelBtn: {
        backgroundColor: Colors.border
    },
    saveBtn: {
        backgroundColor: Colors.primary
    },
    btnText: {
        fontWeight: 'bold',
        color: Colors.text
    }
});
