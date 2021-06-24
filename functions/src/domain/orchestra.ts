export interface Orchestra {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  conductor?: string;
  subConductor?: string;
  homePage: string | null;
}
