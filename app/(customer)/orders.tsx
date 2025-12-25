
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { useData } from '../../context/data';
import { Order } from '../../services/firestore';
import { Colors } from '../../services/mock_api';

export default function OrdersScreen() {
    const { user } = useAuth();
    const { orders, restaurants } = useData();

    const userOrders = orders.filter(o => o.userId === user?.uid).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getRestaurantImage = (restaurantId: string) => {
        const r = restaurants.find(res => res.id === restaurantId);
        return r?.image || 'https://via.placeholder.com/100';
    };

    const STEPS = ['Pending', 'Preparing', 'On the way', 'Delivered'];

    const renderTracker = (status: string) => {
        const currentStepIndex = STEPS.indexOf(status);
        if (currentStepIndex === -1 && status !== 'Cancelled') return null;
        if (status === 'Cancelled') return <Text style={{ color: Colors.error, fontWeight: 'bold', marginTop: 10 }}>Order Cancelled</Text>;

        return (
            <View style={styles.trackerContainer}>
                {STEPS.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    return (
                        <View key={step} style={styles.stepContainer}>
                            <View style={[styles.stepDot, { backgroundColor: isActive ? Colors.primary : '#E0E0E0' }]} />
                            {index < STEPS.length - 1 && (
                                <View style={[styles.stepLine, { backgroundColor: index < currentStepIndex ? Colors.primary : '#E0E0E0' }]} />
                            )}
                            <Text style={[styles.stepLabel, { color: isActive ? Colors.text : Colors.textLight }]}>
                                {step === 'On the way' ? 'Way' : step}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Image source={{ uri: getRestaurantImage(item.restaurantId) }} style={styles.restaurantImage} />
                <View style={styles.headerInfo}>
                    <Text style={styles.restaurantName}>{item.restaurantName || "Restaurant"}</Text>
                    <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
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

            <View style={styles.itemsList}>
                {item.items.map((food, idx) => (
                    <Text key={idx} style={styles.itemText}>
                        {food.quantity}x {food.name} (${food.price})
                    </Text>
                ))}
            </View>

            <View style={styles.divider} />

            {renderTracker(item.status)}

            <View style={styles.orderFooter}>
                <Text style={styles.itemsText}>{item.items.reduce((acc, i) => acc + i.quantity, 0)} Items</Text>
                <Text style={styles.totalText}>${item.totalAmount?.toFixed(2)}</Text>
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
        marginTop: 5
    },
    itemsList: {
        marginBottom: 10
    },
    itemText: {
        fontSize: 14,
        color: Colors.text,
    },
    trackerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginTop: 5,
        paddingHorizontal: 10
    },
    stepContainer: {
        alignItems: 'center',
        width: 60,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 4,
        zIndex: 1
    },
    stepLine: {
        position: 'absolute',
        top: 5,
        left: '50%',
        width: '100%', // Span to next
        height: 2,
        zIndex: 0
    },
    stepLabel: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 10
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
