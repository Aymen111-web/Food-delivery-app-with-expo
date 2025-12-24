
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../services/mock_api';

export default function LandingScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
}
