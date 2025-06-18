// components/dashboard/ProfileSection.tsx
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  name: string;
  grade: string;
  studentId: string;
  dateOfBirth: string;
  gender: string;
  profileImageUrl?: any;
};

export function ProfileSection({ name, grade, studentId, dateOfBirth, gender, profileImageUrl }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.beforeEffect}></View>
        <View style={styles.profileImageContainer}>
          {profileImageUrl ? (
            <Image source={profileImageUrl} style={styles.profileImage} />
          ) : (
            <View style={styles.silhouette}>
              <View style={styles.head} />
              <View style={styles.body} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.info}><Text style={styles.label}>Student name:</Text> {name}</Text>
        <Text style={styles.info}><Text style={styles.label}>Grade:</Text> {grade}</Text>
        <Text style={styles.info}><Text style={styles.label}>Student ID:</Text> {studentId}</Text>
        <Text style={styles.info}><Text style={styles.label}>Date of Birth:</Text> {dateOfBirth}</Text>
        <Text style={styles.info}><Text style={styles.label}>Gender:</Text> {gender}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between', overflow: 'visible' },
  beforeEffect : {
    position: 'absolute',
    height: '165%',
    width: '165%',
    transform: [{translateX: -20}, {translateY: -28}],
    top:0,
    left: 0,
    borderRadius: 100,
    backgroundColor: '#f2f2f2',
    zIndex: 9,
  },
  wrapper : {
    position: 'relative',
    height: 80,
    width: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 100,
    overflow: 'hidden',
    zIndex: 10,
    marginLeft: 10
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  silhouette: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  head: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  body: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 20,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#0d47a1',
    padding: 12,
    borderRadius: 25,
    flex: 1,
  },
  info: {
    color: 'white',
    marginBottom: 4,
    marginLeft: 28,
  },
  label: {
    fontWeight: 'bold',
  },
});
