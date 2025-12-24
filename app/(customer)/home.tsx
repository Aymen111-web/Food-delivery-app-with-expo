
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { addItem } = useCart();
    const { restaurants, categories } = useData();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRestaurants = restaurants.filter((r) => {
        const matchesCategory = selectedCategory ? r.categories.includes(selectedCategory) : true;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.menu.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const renderRestaurant = ({ item }: { item: typeof restaurants[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/(customer)/restaurant/${item.id}`)}
            style={styles.restaurantCard}
        >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.restaurantMeta}>
                    {item.categories.join(', ')} • {item.deliveryTime}
                </Text>

                {/* Quick Menu Preview */}
                <View style={styles.menuPreview}>
                    <Text style={styles.menuTitle}>Popular Items:</Text>
                    {item.menu.slice(0, 2).map((menuItem) => (
                        <View key={menuItem.id} style={styles.menuItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.menuItemName}>{menuItem.name}</Text>
                                <Text style={styles.menuItemPrice}>${menuItem.price.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    addItem({
                                        menuItemId: menuItem.id,
                                        restaurantId: item.id,
                                        name: menuItem.name,
                                        price: menuItem.price,
                                        quantity: 1,
                                    });
                                }}
                            >
                                <Ionicons name="add" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name} 👋</Text>
                    <Text style={styles.location}>Delivering to Home</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=' + user?.name + '&background=random' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find food or restaurants..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Categories */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
                        <TouchableOpacity
                            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
                            onPress={() => setSelectedCategory(null)}
                        >
                            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>All</Text>
                        </TouchableOpacity>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryChip, selectedCategory === cat.name && styles.categoryChipActive]}
                                onPress={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                            >
                                <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Restaurants */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
                    </View>
                    {filteredRestaurants.map(item => (
                        <View key={item.id} style={{ marginBottom: 20 }}>
                            {renderRestaurant({ item })}
                        </View>
                    ))}
                    {filteredRestaurants.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No restaurants found matching your criteria.</Text>
                        </View>
                    )}
                </ScrollView>
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
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    location: {
        fontSize: 14,
        color: Colors.textLight,
    },
    profileButton: {
        padding: 4,
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    categoriesList: {
        paddingHorizontal: 20,
        marginBottom: 10,
        maxHeight: 50,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.card,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        height: 38,
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        color: Colors.text,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#fff',
    },
    restaurantCard: {
        backgroundColor: Colors.card,
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    restaurantImage: {
        width: '100%',
        height: 150,
    },
    restaurantInfo: {
        padding: 15,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: 'bold',
        color: '#FBC02D',
        fontSize: 12,
    },
    restaurantMeta: {
        color: Colors.textLight,
        fontSize: 14,
        marginBottom: 15,
    },
    menuPreview: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: Colors.text,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItemName: {
        fontSize: 14,
        color: Colors.text,
    },
    menuItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    addButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 8,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textLight,
        textAlign: 'center',
    }
});
