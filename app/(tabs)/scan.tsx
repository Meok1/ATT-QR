import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import { COLORS } from '@/constants/colors';
import { STUDENT_ID } from '@/constants/student';
import { registerAttendance } from '@/lib/database'; 

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastData, setLastData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);


  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>
            We need access to your camera to scan QR codes and record attendance.
          </Text>
          <View style={styles.buttonContainer}>
            <AppButton
              theme="primary"
              title="Grant Permission"
              icon="camera"
              onPress={requestPermission}
            />
          </View>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setLastData(data);
    registerAttendance(data, STUDENT_ID).then((result) => {
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
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {!scanned && (
        <View style={styles.guidanceContainer}>
          <View style={styles.guidanceBox}>
            <Text style={styles.guidanceEmoji}>✨</Text>
            <Text style={styles.guidanceText}>Point at a QR code</Text>
          </View>
        </View>
      )}

      {scanned && (
        <View style={styles.resultOverlay}>
          <Card variant="elevated" style={styles.resultCard}>
            <View style={[styles.resultHeader, success && styles.resultHeaderSuccess, !success && styles.resultHeaderError]}>
              <Text style={styles.resultEmoji}>{success ? '✅' : '❌'}</Text>
            </View>
            
            <Text style={styles.resultTitle}>
              {success ? 'Recorded' : 'Failed'}
            </Text>
            
            {message && (
              <Text style={[styles.resultMessage, success ? styles.successText : styles.errorText]}>
                {message}
              </Text>
            )}

            {lastData && (
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>QR Data:</Text>
                <Text style={styles.dataValue}>{lastData}</Text>
              </View>
            )}

            <View style={styles.resultButtonContainer}>
              <AppButton
                theme="primary"
                title="Scan Again"
                icon="refresh"
                onPress={handleScanAgain}
              />
            </View>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    minWidth: 200,
  },
  guidanceContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  guidanceBox: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: COLORS.overlay,
    borderRadius: 12,
  },
  guidanceEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resultOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 20,
  },
  resultCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  resultHeader: {
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultHeaderSuccess: {
    borderBottomColor: COLORS.success,
  },
  resultHeaderError: {
    borderBottomColor: COLORS.error,
  },
  resultEmoji: {
    fontSize: 44,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '500',
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
  dataContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 11,
    marginBottom: 14,
  },
  dataLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 6,
    fontWeight: '600',
  },
  dataValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
  },
  resultButtonContainer: {
    marginTop: 8,
  },
});