export interface SetType {
  name: string;
  codes: CodeType[];
  interval: number;
  description?: string;
}

export interface CodeType {
  name: string;
  description?: string;
  frequency: boolean;
}

export interface GeneralInfo {
  subject: string;
  observer: string;
  notes?: string;
}

export interface SessionFile {
  generalInfo: GeneralInfo;
  set: SetType;
  data: TableRow[];
  videoPath: string;
  videoStartTime: number;
  videoName: string;
}

export interface DataPoint {
  code: string;
  value: number;
  frequency?: boolean;
}

export interface TableRow {
  timestamp: number;
  codes: DataPoint[];
}

export interface MetaData {
  generalInfo: GeneralInfo;
  sessionDate: string;
  setName: string;
  interval: string;
  setDescription: string;
  numberOfEntries: string;
  videoName: string;
  videoStartTime: string;
}