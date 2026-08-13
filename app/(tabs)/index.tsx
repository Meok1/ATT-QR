import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="QR Attendance" />

        <View style={styles.contentContainer}>
          <Card variant="elevated" style={styles.infoCard}>
            <Text style={styles.cardTitle}>Welcome!</Text>
            <Text style={styles.cardDescription}>
              Scan QR codes to mark your attendance during school activities and events.
            </Text>
          </Card>

          <View style={styles.featureGrid}>
            <Card variant="outlined" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>📱</Text>
              <Text style={styles.featureTitle}>Quick Scan</Text>
              <Text style={styles.featureText}>Fast QR scanning</Text>
            </Card>
            <Card variant="outlined" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>📊</Text>
              <Text style={styles.featureTitle}>History</Text>
              <Text style={styles.featureText}>Track attendance</Text>
            </Card>
            <Card variant="outlined" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>👤</Text>
              <Text style={styles.featureTitle}>Profile</Text>
              <Text style={styles.featureText}>Manage account</Text>
            </Card>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <AppButton
            theme="primary"
            title="Scan QR Code"
            icon="qr-code-outline"
            onPress={() => router.push('/scan')}
          />
          <AppButton
            title="Attendance History"
            icon="time-outline"
            onPress={() => router.push('/history')}
          />
          <AppButton
            title="Profile"
            icon="person-outline"
            onPress={() => router.push('/profile')}
          />
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
    marginVertical: 20,
  },
  infoCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderOpacity: 0.15,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: 12,
  },
});
