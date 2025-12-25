
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/cart';
import { Colors } from '../../services/mock_api';

import { useAuth } from '../../context/auth';
import { useData } from '../../context/data';

export default function CartScreen() {
    const { items, removeItem, updateQuantity, totalAmount, totalItems, clearCart } = useCart();
    const router = useRouter();
    const { placeOrder, restaurants } = useData();
    const { user } = useAuth();

    const handleCheckout = () => {
        if (!user) {
            alert('Please login to place an order');
            return;
        }

        // Group items by restaurant
        const ordersByRestaurant = items.reduce((acc, item) => {
            if (!acc[item.restaurantId]) {
                acc[item.restaurantId] = [];
            }
            acc[item.restaurantId].push(item);
            return acc;
        }, {} as Record<string, typeof items>);

        // Create an order for each restaurant
        Object.keys(ordersByRestaurant).forEach(restaurantId => {
            const restaurantItems = ordersByRestaurant[restaurantId];
            const restaurant = restaurants.find(r => r.id === restaurantId);
            const restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';

            const total = restaurantItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            placeOrder({
                userId: user.id,
                userName: user.name,
                restaurantId,
                restaurantName,
                items: restaurantItems.map(i => ({
                    foodId: i.menuItemId,
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price
                })),
                totalAmount: total,
                address: user.address || 'Pick up', // Default if no address
            });
        });

        alert('Order Placed Successfully!');
        clearCart();
        router.push('/(customer)/orders');
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={Colors.textLight} />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(customer)/home')}>
                        <Text style={styles.browseButtonText}>Browse Food</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity onPress={clearCart}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>

                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                <Ionicons name="remove" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Ionicons name="add" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Total Items</Text>
                    <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    clearText: {
        color: Colors.error,
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: Colors.textLight,
        marginTop: 20,
        marginBottom: 30,
    },
    browseButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    cartItem: {
        backgroundColor: Colors.card,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 20,
        padding: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    quantityText: {
        paddingHorizontal: 12,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    footer: {
        backgroundColor: Colors.card,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 15,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
