
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { useData } from '../../context/data';
import { Colors } from '../../services/mock_api';

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const { orders, users } = useData();
    const router = useRouter();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    const stats = [
        { label: 'Total Orders', value: orders.length.toString(), icon: 'receipt-outline', color: '#4ECDC4' },
        { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: 'cash-outline', color: '#FF6B6B' },
        { label: 'Users', value: users.length.toString(), icon: 'people-outline', color: '#FFA502' },
        { label: 'Pending', value: pendingOrders.toString(), icon: 'time-outline', color: '#A6C1EE' },
    ];

    const actions = [
        { label: 'Manage Restaurants', icon: 'restaurant-outline', route: '/(admin)/restaurants' },
        { label: 'Manage Menu', icon: 'fast-food-outline', route: '/(admin)/menu' },
        { label: 'Categories', icon: 'list-outline', route: '/(admin)/categories' },
        { label: 'All Orders', icon: 'receipt-outline', route: '/(admin)/orders' },
        { label: 'User Management', icon: 'people-circle-outline', route: '/(admin)/users' },
    ];

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Return to login?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: signOut }
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Stats Grid */}
                <Text style={styles.sectionTitle}>Overview</Text>
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsList}>
                    {actions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionItem}
                            onPress={() => router.push(action.route as any)}
                        >
                            <View style={styles.actionLeft}>
                                <Ionicons name={action.icon as any} size={24} color={Colors.text} />
                                <Text style={styles.actionText}>{action.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity (Just showing last 3 orders) */}
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <View style={styles.activityCard}>
                    {orders.slice(0, 3).map((o, i) => (
                        <View key={o.id}>
                            <View style={styles.activityItem}>
                                <View style={[styles.dot, { backgroundColor: o.status === 'Pending' ? Colors.error : Colors.success }]} />
                                <Text style={styles.activityText}>Order #{o.id.substr(0, 4)}: {o.status} - ${o.totalAmount}</Text>
                            </View>
                            {i < 2 && <View style={styles.separator} />}
                        </View>
                    ))}
                    {orders.length === 0 && <Text style={{ textAlign: 'center', color: Colors.textLight }}>No recent activity</Text>}
                </View>

            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
        marginTop: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginBottom: 20,
    },
    statCard: {
        backgroundColor: Colors.card,
        width: '47%',
        padding: 15,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textLight,
    },
    actionsList: {
        marginBottom: 20,
    },
    actionItem: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 1,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    activityCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityText: {
        fontSize: 14,
        color: Colors.text,
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 10,
    },
});
