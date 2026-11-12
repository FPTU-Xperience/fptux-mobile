import {
    CalendarDays,
    Compass,
    Sparkles,
    User,
    Users,
    type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ACTIVE = '#F97316';
const INACTIVE = '#8E8E93';

type TabConfig = { icon: LucideIcon; label: string };

// key = tên route (tên file trong app/(tabs)). Route không có ở đây sẽ không hiện trên bar
// (vd: scan, my-clubs).
const TABS: Record<string, TabConfig> = {
    explore: { icon: Compass, label: 'Khám Phá' },
    allClubs: { icon: Users, label: 'Câu lạc bộ' },
    activity: { icon: Sparkles, label: 'Hoạt động' },
    schedule: { icon: CalendarDays, label: 'Lịch Trình' },
    profile: { icon: User, label: 'Hồ sơ' },
};

// Route phụ (không hiện trên bar) -> tab cha sẽ được tô sáng khi đang ở route phụ đó
const PARENT_TAB: Record<string, string> = {
    'my-clubs': 'profile',
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
            canPreventDefault: true;
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
    // Tên tab cần tô sáng: nếu đang ở route phụ thì lấy tab cha
    const currentName = state.routes[state.index]?.name;
    const activeName = PARENT_TAB[currentName] ?? currentName;

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {state.routes.map((route, index) => {
                const config = TABS[route.name];
                if (!config) return null;

                const focused = route.name === activeName;
                const isCurrentRoute = state.index === index;
                const Icon = config.icon;

                const onPress = () => {
                    const event = emitter.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    // Dùng isCurrentRoute (không dùng focused) để bấm lại tab cha
                    // khi đang ở route phụ vẫn quay về được
                    if (!isCurrentRoute && !event?.defaultPrevented) {
                        navigateToTab(route.key);
                    }
                };

                const color = focused ? ACTIVE : INACTIVE;

                return (
                    <Pressable key={route.key} onPress={onPress} style={styles.tab}>
                        <Icon size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
                        <Text style={[styles.label, { color }]} numberOfLines={1}>
                            {config.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 10,
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
});