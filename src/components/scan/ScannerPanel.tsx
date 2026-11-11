// components/scan/ScannerPanel.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, Navigation, X, Zap, ZapOff } from 'lucide-react-native';
import {
    ActivityIndicator,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import ScanFrame from './ScanFrame';

type Props = {
    /** Chỉ bật camera khi tab đang được focus */
    active: boolean;
    /** Tạm dừng nhận mã (vd: đang xử lý điểm danh) */
    scanEnabled: boolean;
    torch: boolean;
    onToggleTorch: () => void;
    onClose: () => void;
    onScan: (code: string) => void;
};

export default function ScannerPanel({
    active,
    scanEnabled,
    torch,
    onToggleTorch,
    onClose,
    onScan,
}: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const { width, height } = useWindowDimensions();

    const panelWidth = width - 32;
    const panelHeight = Math.min(panelWidth * 1.45, height * 0.58);
    const frameSize = Math.min(panelWidth * 0.62, panelHeight * 0.55);

    const granted = permission?.granted === true;

    return (
        <View style={[styles.panel, { height: panelHeight }]}>
            {granted && active && (
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    autofocus="on"
                    enableTorch={torch}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={scanEnabled ? ({ data }) => onScan(data) : undefined}
                />
            )}
            <View style={styles.tint} pointerEvents="none" />

            {/* Thanh trên */}
            <View style={styles.header}>
                <Pressable style={styles.roundButton} onPress={onClose} hitSlop={8}>
                    <X size={18} color="#fff" />
                </Pressable>

                <View style={styles.titleWrap}>
                    <Text style={styles.title}>Quét mã điểm danh</Text>
                    <View style={styles.subRow}>
                        <View style={styles.subDot} />
                        <Text style={styles.subText}>Camera tự động lấy nét</Text>
                    </View>
                </View>

                <Pressable
                    style={[styles.roundButton, torch && styles.roundButtonOn]}
                    onPress={onToggleTorch}
                    hitSlop={8}
                    disabled={!granted}>
                    {torch ? <Zap size={18} color="#fff" /> : <ZapOff size={18} color="#fff" />}
                </Pressable>
            </View>

            {/* Khu vực giữa */}
            <View style={styles.center}>
                {permission === null ? (
                    <ActivityIndicator color="#F97316" />
                ) : granted ? (
                    <>
                        <ScanFrame size={frameSize} />
                        <View style={styles.hint}>
                            <Text style={styles.hintText}>
                                Căn chỉnh mã QR của hoạt động hoặc ban tổ chức vào giữa khung hình
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.permission}>
                        <View style={styles.permissionIcon}>
                            <Camera size={26} color="#F97316" />
                        </View>
                        <Text style={styles.permissionTitle}>Cần quyền truy cập camera</Text>
                        <Text style={styles.permissionDesc}>
                            Cho phép ứng dụng dùng camera để quét mã QR điểm danh.
                        </Text>
                        <Pressable
                            style={styles.permissionButton}
                            onPress={() =>
                                permission.canAskAgain ? requestPermission() : Linking.openSettings()
                            }>
                            <Text style={styles.permissionButtonText}>
                                {permission.canAskAgain ? 'Cấp quyền camera' : 'Mở cài đặt'}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* Dòng dưới */}
            <View style={styles.footer}>
                <Navigation size={12} color="#F97316" />
                <Text style={styles.footerText}>Khoảng cách quét tối ưu: 20cm – 35cm</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 28,
        backgroundColor: '#0B1220',
        overflow: 'hidden',
    },
    tint: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingTop: 14,
    },
    roundButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundButtonOn: { backgroundColor: '#F97316' },
    titleWrap: { alignItems: 'center' },
    title: { color: '#fff', fontSize: 14, fontWeight: '800' },
    subRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
    subDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#F97316' },
    subText: { color: '#FDBA74', fontSize: 10.5, fontWeight: '600' },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 },
    hint: {
        maxWidth: '78%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(30,41,59,0.75)',
    },
    hintText: { color: '#E5E7EB', fontSize: 12, lineHeight: 17, textAlign: 'center' },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingBottom: 38, // chừa chỗ cho thẻ vị trí đè lên
    },
    footerText: { color: '#E5E7EB', fontSize: 11, fontWeight: '600' },

    permission: { alignItems: 'center', paddingHorizontal: 32 },
    permissionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(249,115,22,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 14 },
    permissionDesc: {
        color: '#CBD5E1',
        fontSize: 12.5,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: 6,
    },
    permissionButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 11,
        borderRadius: 999,
        backgroundColor: '#F97316',
    },
    permissionButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});