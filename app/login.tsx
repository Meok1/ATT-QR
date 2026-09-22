import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { signIn } from '@/lib/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { registered } = useLocalSearchParams<{ registered?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signIn(email.trim(), password);
      if (authError) setError(authError.message);
      else router.replace('/(tabs)');
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to record your attendance.</Text>
              {registered === '1' && (
                <Text style={styles.notice}>
                  Account created. Check your email to confirm it, then sign in.
                </Text>
              )}
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your.email@school.edu" placeholderTextColor={COLORS.textTertiary} autoCapitalize="none" autoComplete="email" keyboardType="email-address" returnKeyType="next" editable={!loading} />
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={COLORS.textTertiary} autoComplete="password" secureTextEntry returnKeyType="done" onSubmitEditing={handleLogin} editable={!loading} />
              {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
              {loading ? <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} /> : <AppButton theme="primary" title="Sign In" icon="log-in-outline" onPress={handleLogin} />}
              <Link href="/register" style={styles.link}>Don't have an account? Sign Up</Link>
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
  notice: { backgroundColor: COLORS.surfaceLight, borderColor: COLORS.primary, borderRadius: 10, borderWidth: 1, color: COLORS.textPrimary, fontSize: 14, lineHeight: 20, marginBottom: 18, padding: 12, textAlign: 'center' },
  loader: { marginVertical: 12 },
  link: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '600', marginTop: 10, paddingVertical: 12, textAlign: 'center' },
});
