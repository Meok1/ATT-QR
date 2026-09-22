import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { registerAttendance } from '@/lib/attendance';

export default function ScanScreen() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastData, setLastData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>We need access to your camera to scan QR codes and record attendance.</Text>
          <View style={styles.buttonContainer}><AppButton theme="primary" title="Grant Permission" icon="camera" onPress={requestPermission} /></View>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setLastData(data);
    registerAttendance(data, user?.id ?? 'unknown').then((result) => {
      setMessage(result.message);
      setSuccess(result.success);
    });
  };

  const handleScanAgain = () => {
    setScanned(false);
    setLastData(null);
    setMessage(null);
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} />
      {!scanned && <View style={styles.guidanceContainer}><View style={styles.guidanceBox}><Text style={styles.guidanceText}>Point at a QR code</Text></View></View>}
      {scanned && <View style={styles.resultOverlay}><Card variant="elevated" style={styles.resultCard}>
        <Text style={styles.resultEmoji}>{success ? '✅' : '❌'}</Text>
        <Text style={styles.resultTitle}>{success ? 'Recorded' : 'Failed'}</Text>
        {message && <Text style={[styles.resultMessage, success ? styles.successText : styles.errorText]}>{message}</Text>}
        {lastData && <View style={styles.dataContainer}><Text style={styles.dataLabel}>QR Data:</Text><Text style={styles.dataValue}>{lastData}</Text></View>}
        <AppButton theme="primary" title="Scan Again" icon="refresh" onPress={handleScanAgain} />
      </Card></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: COLORS.background, justifyContent: 'center' },
  camera: { ...StyleSheet.absoluteFillObject },
  permissionContent: { alignItems: 'center', paddingHorizontal: 32 },
  permissionEmoji: { fontSize: 64, marginBottom: 20 },
  title: { color: COLORS.textPrimary, fontSize: 21, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: 24, textAlign: 'center' },
  buttonContainer: { minWidth: 200, width: '100%' },
  guidanceContainer: { alignItems: 'center', bottom: 80, left: 0, position: 'absolute', right: 0 },
  guidanceBox: { backgroundColor: COLORS.overlay, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 14 },
  guidanceText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  resultOverlay: { backgroundColor: COLORS.overlay, bottom: 0, left: 0, paddingHorizontal: 16, paddingBottom: 24, paddingTop: 20, position: 'absolute', right: 0 },
  resultCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  resultEmoji: { fontSize: 44, textAlign: 'center' },
  resultTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  resultMessage: { fontSize: 13, fontWeight: '500', marginBottom: 14, textAlign: 'center' },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.error },
  dataContainer: { backgroundColor: COLORS.surface, borderRadius: 10, marginBottom: 14, padding: 11 },
  dataLabel: { color: COLORS.textTertiary, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  dataValue: { color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: 12 },
});