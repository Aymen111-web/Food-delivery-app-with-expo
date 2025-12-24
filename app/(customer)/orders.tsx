import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function OrdersScreen() {
    const { user } = useAuth();
    const { orders, restaurants } = useData();

    // Filter orders for the logged in user
    const userOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Helper to get restaurant image
    const getRestaurantImage = (restaurantId: string) => {
        const r = restaurants.find(res => res.id === restaurantId);
        return r?.image || 'https://via.placeholder.com/100'; // Fallback
    };
    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Image source={{ uri: getRestaurantImage(item.restaurantId) }} style={styles.restaurantImage} />
                <View style={styles.headerInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Delivered' ? Colors.success + '20' : Colors.warning + '20' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'Delivered' ? Colors.success : Colors.warning }
                    ]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderFooter}>
                <Text style={styles.itemsText}>{item.items.reduce((acc, i) => acc + i.quantity, 0)} Items</Text>
                <Text style={styles.totalText}>${item.totalAmount.toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Order History</Text>
            </View>

            <FlatList
                data={userOrders}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderOrderItem}
                ListFooterComponent={
                    <Text style={styles.footerNote}>{userOrders.length === 0 ? "No orders yet" : "End of list"}</Text>
                }
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
    listContent: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    restaurantImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textLight,
    },
    statusBadge: {
        backgroundColor: Colors.success + '20',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusText: {
        color: Colors.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemsText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    footerNote: {
        textAlign: 'center',
        color: Colors.textLight,
        marginTop: 10,
        marginBottom: 30,
    }
});
