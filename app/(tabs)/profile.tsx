import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { useAuth, signOut } from '@/lib/auth';
import { getProfile, updateProfile, type Profile } from '@/lib/profiles';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draftName, setDraftName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const currentProfile = await getProfile(user.id);
    setProfile(currentProfile);
    setDraftName(currentProfile?.full_name ?? '');
  }, [user]);

  useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));

  const handleSaveName = async () => {
    if (!user || !draftName.trim()) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, { full_name: draftName.trim() });
    if (error) Alert.alert('Could not save name', error);
    else { setEditing(false); await loadProfile(); }
    setSaving(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {user && (
        <View style={styles.infoCard}>
          <View style={styles.nameHeader}>
            <View style={styles.nameContent}>
              <Text style={styles.label}>Name</Text>
              {editing ? <TextInput style={styles.nameInput} value={draftName} onChangeText={setDraftName} editable={!saving} /> : <Text style={styles.name}>{profile?.full_name || 'Add your name'}</Text>}
            </View>
            <Pressable onPress={() => setEditing((value) => !value)} disabled={saving}><Text style={styles.editAction}>{editing ? 'Cancel' : 'Edit'}</Text></Pressable>
          </View>
          {editing && <Pressable style={styles.saveButton} onPress={handleSaveName} disabled={saving}>{saving ? <ActivityIndicator color={COLORS.textOnPrimary} /> : <Text style={styles.saveText}>Save Name</Text>}</Pressable>}
          <Text style={styles.label}>Role</Text>
          <Text style={styles.role}>{profile?.role === 'teacher' ? 'Teacher' : 'Student'}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>User ID</Text>
          <Text style={styles.valueSmall}>{user.id}</Text>
        </View>
      )}

      <AppButton
        title="Sign Out"
        icon="log-out-outline"
        onPress={handleSignOut}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  valueSmall: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  nameHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  nameContent: { flex: 1 },
  name: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  nameInput: { borderBottomColor: COLORS.primary, borderBottomWidth: 1, color: COLORS.textPrimary, fontSize: 17, paddingVertical: 4 },
  editAction: { color: COLORS.primary, fontSize: 14, fontWeight: '700', padding: 8 },
  role: { color: COLORS.primary, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  saveButton: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 10, marginTop: 12, paddingVertical: 10 },
  saveText: { color: COLORS.textOnPrimary, fontWeight: '700' },
});
