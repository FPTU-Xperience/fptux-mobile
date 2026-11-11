import {
    CalendarDays,
    Compass,
    ScanQrCode,
    Sparkles,
    User,
    type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ACTIVE = '#F97316';
const INACTIVE = '#8E8E93';

type TabConfig = { icon: LucideIcon; label?: string; center?: boolean };

// key = tên route (tên file trong app/(tabs))
const TABS: Record<string, TabConfig> = {
    explore: { icon: Compass, label: 'Khám phá' },
    activity: { icon: Sparkles, label: 'Hoạt động' },
    scan: { icon: ScanQrCode, center: true },
    schedule: { icon: CalendarDays, label: 'Lịch trình' },
    profile: { icon: User, label: 'Profile' },
};

// Type tối thiểu, khớp với props mà tabBar thực sự nhận
type AppTabBarProps = {
    state: {
        index: number;
        routes: { key: string; name: string }[];
    };
    emitter: {
        emit: (event: {
            type: 'tabPress';
            target: string;
            canPreventDefault: true; // đổi từ boolean thành true
        }) => { defaultPrevented?: boolean };
    };
    navigateToTab: (routeKey: string) => void;
    insets: { bottom: number };
};

export default function AppTabBar({
    state,
    emitter,
    navigateToTab,
    insets,
}: AppTabBarProps) {
    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {state.routes.map((route, index) => {
                const config = TABS[route.name];
                if (!config) return null;

                const focused = state.index === index;
                const Icon = config.icon;

                const onPress = () => {
                    const event = emitter.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!focused && !event?.defaultPrevented) {
                        navigateToTab(route.key);
                    }
                };

                if (config.center) {
                    return (
                        <View key={route.key} style={styles.centerSlot}>
                            <Pressable onPress={onPress} style={styles.centerButton}>
                                <Icon size={30} color="#fff" strokeWidth={2} />
                            </Pressable>
                        </View>
                    );
                }

                const color = focused ? ACTIVE : INACTIVE;

                return (
                    <Pressable key={route.key} onPress={onPress} style={styles.tab}>
                        <Icon size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
                        <Text style={[styles.label, { color }]}>{config.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        paddingTop: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 12,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
    },
    centerSlot: {
        flex: 1,
        alignItems: 'center',
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: ACTIVE,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -32,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: ACTIVE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
    },
});