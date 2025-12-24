
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../../context/cart';
import { useData } from '../../../context/data'; // MenuItem type alias from data context
import { Colors } from '../../../services/mock_api'; // Keep colors for now

export default function RestaurantDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { restaurants, fetchRestaurantMenu } = useData();
    const { addItem } = useCart();
    const router = useRouter();

    // Convert id to string safely
    const restaurantId = Array.isArray(id) ? id[0] : id;

    const restaurant = restaurants.find(r => r.id === restaurantId);

    // Menu state
    const [menu, setMenu] = useState<any[]>([]); // Use any temporarily or FoodItem from services
    const [loadingMenu, setLoadingMenu] = useState(true);

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantMenu(restaurantId).then(items => {
                setMenu(items);
                setLoadingMenu(false);
            });
        }
    }, [restaurantId]);

    if (!restaurant) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text>Restaurant not found</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderMenuItem = (item: any) => (
        <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    addItem({
                        menuItemId: item.id,
                        restaurantId: restaurant.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                    });
                }}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: restaurant.image }} style={styles.image} />
                    <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.overlay} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>{restaurant.name}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color="#000" />
                                <Text style={styles.ratingText}>{restaurant.rating || 'N/A'}</Text>
                            </View>
                            <Text style={styles.metaText}>• {restaurant.deliveryTime} • {restaurant.categories.join(', ')}</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Menu</Text>
                    {loadingMenu ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : (
                        menu.map(renderMenuItem)
                    )}
                </View>
            </ScrollView>

            {/* View Cart Button (Floating) */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.viewCartBtn} onPress={() => router.push('/(customer)/cart')}>
                    <Text style={styles.viewCartText}>View Cart</Text>
                    <Ionicons name="cart" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: 100,
    },
    imageContainer: {
        height: 250,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerBackBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    headerInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 4,
    },
    metaText: {
        color: '#eee',
        fontSize: 14,
        fontWeight: '600',
    },
    menuSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
    },
    menuItem: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    menuItemInfo: {
        flex: 1,
        marginRight: 15,
    },
    menuItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    menuItemDesc: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 8,
    },
    menuItemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    addButton: {
        backgroundColor: Colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    viewCartBtn: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        gap: 10,
    },
    viewCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
    }
});
