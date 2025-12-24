import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order, OrderStatus, useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
    const { orders, updateOrderStatus } = useData();
    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        setSelectedOrder(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let color = Colors.textLight;
        if (status === 'Pending') color = Colors.warning;
        if (status === 'Preparing') color = Colors.secondary;
        if (status === 'On the way') color = Colors.primary;
        if (status === 'Delivered') color = Colors.success;

        return (
            <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
                <Text style={[styles.statusText, { color }]}>{status}</Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedOrder(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <View style={styles.cardBody}>
                <View>
                    <Text style={styles.restaurant}>{item.restaurantName}</Text>
                    <Text style={styles.user}>Cust: {item.userName}</Text>
                </View>
                <Text style={styles.total}>${item.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.cardFooter}>
                <StatusBadge status={item.status} />
                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Orders</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
            />

            {/* Status Update Modal */}
            <Modal
                visible={selectedOrder !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedOrder(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Order Status</Text>
                        <Text style={styles.modalSubtitle}>{selectedOrder?.id} - {selectedOrder?.restaurantName}</Text>

                        <View style={styles.statusOptions}>
                            {ORDER_STATUSES.map(status => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusOption,
                                        selectedOrder?.status === status && styles.statusOptionActive
                                    ]}
                                    onPress={() => selectedOrder && handleStatusUpdate(selectedOrder.id, status)}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        selectedOrder?.status === status && styles.statusOptionTextActive
                                    ]}>{status}</Text>
                                    {selectedOrder?.status === status && (
                                        <Ionicons name="checkmark" size={20} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedOrder(null)}>
                            <Text style={styles.closeBtnText}>Cancel</Text>
                        </TouchableOpacity>
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
        padding: 15,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderId: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    date: {
        fontSize: 12,
        color: Colors.textLight,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    restaurant: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    user: {
        fontSize: 14,
        color: Colors.textLight,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: 20,
    },
    statusOptions: {
        gap: 10,
        marginBottom: 20,
    },
    statusOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
    },
    statusOptionActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statusOptionText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    statusOptionTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 15,
        alignItems: 'center',
    },
    closeBtnText: {
        color: Colors.textLight,
        fontSize: 16,
    },
});
