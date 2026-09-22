import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Card from '@/components/Card';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';
import { getProfile } from '@/lib/profiles';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<TeacherEventAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentRole = (await getProfile(user.id))?.role ?? 'student';
    setRole(currentRole);

    if (currentRole === 'teacher') {
      setTeacherEvents(await getTeacherEventAttendance(user.id));
      setStudentRecords([]);
    } else {
      setStudentRecords(await getAttendanceHistory(user.id));
      setTeacherEvents([]);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { loadHistory(); }, [loadHistory]));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}><Header title="History" /></View>
      {loading ? <EmptyState title="Loading records..." /> : role === 'teacher' ? <TeacherHistory events={teacherEvents} /> : <StudentHistory records={studentRecords} />}
    </SafeAreaView>
  );
}

function StudentHistory({ records }: { records: AttendanceRecord[] }) {
  if (!records.length) return <EmptyState title="No attendance records yet" subtitle="Scan a QR code to start recording your attendance." />;
  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card variant="default" style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <MaterialIcons name="done-all" size={20} color={COLORS.success} />
            <View style={styles.recordContent}>
              <Text style={styles.eventTitle}>{item.eventTitle}</Text>
              <Text style={styles.eventId}>{item.eventId}</Text>
            </View>
          </View>
          <Text style={styles.eventTime}>{formatDate(item.scannedAt)}</Text>
        </Card>
      )}
    />
  );
}

function TeacherHistory({ events }: { events: TeacherEventAttendance[] }) {
  if (!events.length) return <EmptyState title="No events yet" subtitle="Create an event from the Teacher tab to see attendance here." />;
  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.eventId}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card variant="default" style={styles.recordCard}>
          <View style={styles.teacherHeader}>
            <View style={styles.recordContent}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventId}>{item.eventCode}</Text>
            </View>
            <Text style={styles.countBadge}>{item.attendeeCount}</Text>
          </View>
          <Text style={styles.eventTime}>{item.startTime ? formatDate(item.startTime) : 'No start time'}</Text>
          {item.attendees.length ? item.attendees.map((attendee) => (
            <View key={`${attendee.studentId}-${attendee.scannedAt}`} style={styles.attendeeRow}>
              <Text style={styles.attendeeName}>{attendee.fullName ?? shortId(attendee.studentId)}</Text>
              <Text style={styles.attendeeTime}>{formatDate(attendee.scannedAt)}</Text>
            </View>
          )) : <Text style={styles.noAttendees}>No attendees yet</Text>}
        </Card>
      )}
    />
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.emptyContainer}><Text style={styles.emptyTitle}>{title}</Text>{subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}</View>;
}

function shortId(id: string) { return id ? `...${id.slice(-8)}` : 'unknown'; }
function formatDate(iso: string) { return new Date(iso).toLocaleString(); }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerWrapper: { paddingHorizontal: 16 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 24 },
  recordCard: { borderLeftColor: COLORS.success, borderLeftWidth: 3, marginBottom: 10 },
  recordHeader: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  teacherHeader: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  recordContent: { flex: 1, marginLeft: 11 },
  eventTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  eventId: { color: COLORS.textTertiary, fontFamily: 'monospace', fontSize: 11 },
  eventTime: { color: COLORS.textTertiary, fontSize: 12 },
  countBadge: { backgroundColor: COLORS.success, borderRadius: 10, color: COLORS.textOnPrimary, fontWeight: '700', minWidth: 34, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5, textAlign: 'center' },
  attendeeRow: { borderTopColor: COLORS.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 9, paddingTop: 9 },
  attendeeName: { color: COLORS.textPrimary, flex: 1, fontSize: 13 },
  attendeeTime: { color: COLORS.textSecondary, fontSize: 11 },
  noAttendees: { color: COLORS.textSecondary, fontSize: 12, marginTop: 10 },
});