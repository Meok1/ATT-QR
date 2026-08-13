import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '@/constants/colors';
import Card from '@/components/Card';
import Header from '@/components/Header';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Profile" />

        <View style={styles.contentContainer}>
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>User Profile</Text>
                <Text style={styles.userStatus}>Active Student</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Attendance Summary</Text>
          <Card variant="default">
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>--</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>--</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>--</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <Card variant="outlined">
            <View style={styles.comingSoonItem}>
              <Text style={styles.comingSoonEmoji}>🔧</Text>
              <View>
                <Text style={styles.comingSoonTitle}>Profile Customization</Text>
                <Text style={styles.comingSoonText}>Manage your profile information</Text>
              </View>
            </View>
          </Card>

          <Card variant="outlined" style={styles.marginTop}>
            <View style={styles.comingSoonItem}>
              <Text style={styles.comingSoonEmoji}>⚙️</Text>
              <View>
                <Text style={styles.comingSoonTitle}>Settings</Text>
                <Text style={styles.comingSoonText}>Notification preferences & more</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contentContainer: {
    marginTop: 16,
  },
  profileCard: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderOpacity: 0.15,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  userStatus: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 11,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  comingSoonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  comingSoonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  marginTop: {
    marginTop: 11,
  },
});
