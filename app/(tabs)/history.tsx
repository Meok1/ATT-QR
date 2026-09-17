import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Card from '@/components/Card';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { STUDENT_ID } from '@/constants/student';
import { useAuth } from '@/lib/auth';
import { getAttendanceHistory, type AttendanceRecord } from '@/lib/database';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(() => {
    getAttendanceHistory(user?.id ?? STUDENT_ID).then((rows) => {
      setRecords(rows);
      setLoading(false);
    });
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="History" />
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.loadingEmoji}>⏳</Text>
          <Text style={styles.emptyTitle}>Loading records...</Text>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No attendance records yet</Text>
          <Text style={styles.emptySubtitle}>
            Scan a QR code to start recording your attendance.
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Card variant="default" style={[styles.recordCard, index === 0 && styles.firstCard]}>
              <View style={styles.recordHeader}>
                <View style={styles.recordIconContainer}>
                  <MaterialIcons 
                    name="done-all" 
                    size={20} 
                    color={COLORS.success} 
                  />
                </View>
                <View style={styles.recordContent}>
                  <Text style={styles.eventTitle}>{item.eventTitle}</Text>
                  <Text style={styles.eventId}>{item.eventId}</Text>
                </View>
              </View>
              <View style={styles.recordFooter}>
                <MaterialIcons 
                  name="access-time" 
                  size={14} 
                  color={COLORS.textTertiary} 
                />
                <Text style={styles.eventTime}>{formatDate(item.scannedAt)}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let dateStr = '';
  if (date.toDateString() === today.toDateString()) {
    dateStr = 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateStr = 'Yesterday';
  } else {
    dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} at ${time}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerWrapper: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 14,
  },
  loadingEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  firstCard: {
    marginTop: 8,
  },
  recordCard: {
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  recordContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  eventId: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontFamily: 'monospace',
  },
  recordFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  eventTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginLeft: 8,
    fontWeight: '500',
  },
});
