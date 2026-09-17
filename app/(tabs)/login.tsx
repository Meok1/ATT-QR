import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { signIn } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }

    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={34} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to record your attendance.</Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email address"
        placeholderTextColor={COLORS.textTertiary}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoComplete="password"
        placeholder="Password"
        placeholderTextColor={COLORS.textTertiary}
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <AppButton
        title={loading ? 'Logging in...' : 'Log In'}
        icon="log-in-outline"
        disabled={loading}
        onPress={handleLogin}
      />

      <Pressable onPress={() => router.push('/register')} style={styles.link}>
        <Text style={styles.linkText}>New here? Create an account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLORS.background },
  iconWrap: { alignSelf: 'center', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 28, height: 56, justifyContent: 'center', marginBottom: 18, width: 56 },
  title: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 28, marginTop: 8, textAlign: 'center' },
  input: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, color: COLORS.textPrimary, fontSize: 15, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 13 },
  link: { alignItems: 'center', marginTop: 22 },
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});
