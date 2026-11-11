// components/common/SearchBar.tsx
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPressFilter?: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onPressFilter,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Search size={18} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        numberOfLines={1}
      />
      <SlidersHorizontal size={18} color="#9CA3AF" onPress={onPressFilter} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 0 },
});