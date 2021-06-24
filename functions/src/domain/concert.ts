export interface Concert {
  id: string;
  title: string;
  programs: string;
  symphonies: string[];
  location: FirebaseFirestore.GeoPoint;
  date: FirebaseFirestore.Timestamp;
  openAt: FirebaseFirestore.Timestamp;
  startAt: FirebaseFirestore.Timestamp;
  closeAt: FirebaseFirestore.Timestamp;
  participantsCount: number;
}

export interface ConcertReq
  extends Omit<Concert, 'date' | 'openAt' | 'closeAt' | 'startAt'> {
  date: Date;
  openAt: Date;
  startAt: Date;
  closeAt: Date;
}
