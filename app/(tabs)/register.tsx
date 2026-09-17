import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { signUp } from '@/lib/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Registration failed', error.message);
      return;
    }
    if (data.session) {
      router.replace('/');
      return;
    }

    Alert.alert('Check your email', 'Confirm your email address, then log in.');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="person-add" size={34} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Use your school email to get started.</Text>

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
        autoComplete="new-password"
        placeholder="Password (at least 6 characters)"
        placeholderTextColor={COLORS.textTertiary}
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <AppButton
        title={loading ? 'Creating account...' : 'Create Account'}
        icon="person-add-outline"
        disabled={loading}
        onPress={handleRegister}
      />

      <Pressable onPress={() => router.replace('/login')} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
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
