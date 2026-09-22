import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { signUp } from '@/lib/auth';
import type { Role } from '@/lib/profiles';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!email.trim() || !fullName.trim() || !password || !confirmPassword) return setError('All fields are required.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      const { data, error: authError } = await signUp(email.trim(), password, { full_name: fullName.trim(), role });
      if (authError) setError(authError.message);
      else if (data.session) router.replace('/(tabs)');
      else router.replace({ pathname: '/login', params: { registered: '1' } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}><Header title="QR Attendance" /></View>
            <View style={styles.formArea}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Register to start recording attendance.</Text>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor={COLORS.textTertiary} autoComplete="name" returnKeyType="next" editable={!loading} />
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your.email@school.edu" placeholderTextColor={COLORS.textTertiary} autoCapitalize="none" autoComplete="email" keyboardType="email-address" returnKeyType="next" editable={!loading} />
              <Text style={styles.label}>I am a…</Text>
              <View style={styles.roleRow}>
                {(['student', 'teacher'] as Role[]).map((option) => <Pressable key={option} onPress={() => setRole(option)} style={[styles.roleChip, role === option && styles.roleChipActive]}><Text style={[styles.roleText, role === option && styles.roleTextActive]}>{option === 'student' ? 'Student' : 'Teacher'}</Text></Pressable>)}
              </View>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={COLORS.textTertiary} autoComplete="new-password" secureTextEntry returnKeyType="next" editable={!loading} />
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" placeholderTextColor={COLORS.textTertiary} autoComplete="new-password" secureTextEntry returnKeyType="done" onSubmitEditing={handleRegister} editable={!loading} />
              {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
              {loading ? <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} /> : <AppButton theme="primary" title="Sign Up" icon="person-add-outline" onPress={handleRegister} />}
              <Link href="/login" style={styles.link}>Already have an account? Sign In</Link>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  headerContainer: { marginBottom: 18 },
  formArea: { flex: 1, justifyContent: 'center', width: '100%', maxWidth: 480, alignSelf: 'center' },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: 30, textAlign: 'center' },
  label: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, color: COLORS.textPrimary, fontSize: 16, marginBottom: 18, minHeight: 52, paddingHorizontal: 14 },
  error: { color: COLORS.error, fontSize: 14, lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  loader: { marginVertical: 12 },
  link: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '600', marginTop: 10, paddingVertical: 12, textAlign: 'center' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  roleChip: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, flex: 1, minHeight: 48, justifyContent: 'center' },
  roleChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  roleText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '600' },
  roleTextActive: { color: COLORS.primaryDark },
});
