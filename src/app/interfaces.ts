export interface LoginInfo {
  fullname: string;
  position: string;
  role: number;
  token: string;
}

export interface Phone {
    id: number;
    number: string;
    location: string;
    hc: string;
    kc: string;
    tc1: string;
    tc2: string;
    tc3: string;
    tc4: string;
    tc5: string;
}

export interface IssueType {
  value: number
  name: string
}

export interface Issue {
    id: number;
    issueno: string;
    phone: Phone;
    phoneby: string;
    tech?: User;
    created: Date;
    issuetype: number;
    issuetypeother: string;
    issueby: string;
    issuecontactno: string;
    issuelocation: string;
    issuedescription: string;
    issuecause: string;
    issuesolution: string;
    engineercode: string;
    ext: string;
    finisheddate: Date;
    status: number;
    parts: Part[];
}

export interface LineswapIssue {
    id: number;
    issueno: string;
    phone: Phone;
    phoneby: string;
    created: Date;
    issuetype: number;
    issuetypeother: string;
    issueby: string;
    issuecontactno: string;
    issuelocation: string;
    issuedescription: string;
    issuecause: string;
    issuesolution: string;
    engineercode: string;
    ext: string;
    finisheddate: Date;
    status: number;
}
export interface APIfileAttach {
  success: boolean;
  issue: string;
  data: FileAttachInfomation[];
}

export interface FileAttachInfomation {
    issueno: string;
    order: number;
    filepath: string;
    b64: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
}

export interface Equipment {
  id: number;
  code: string;
  name: string;
  group: Group | undefined;
}

export interface Group {
  id: number;
  code: string;
  name: string;
}
export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  password: string;
  role: number;
  firstname: string;
  lastname: string;
  position: string;
  status: number;
}

export interface Part {
  issueid: number;
  partprofileid: number;
  rank: number;
  code: string;
  name: string;
  qty: number;
  unit: string;
  remark: string;
}

export interface PartProfile {
  id: number;
  rank: number;
  code: string;
  name: string;
  unit: string;
}
export interface PartUsage {
  issueid: number;
  partid: number;
  rank: number;
  code: string;
  name: string;
  qty: number;
  unit: string;
  remark: string;
}

export interface APIResult {
  issueno: string;
  success: boolean;
}

export interface APIget {
  id: string;
  success: boolean;
  data: string;
}

export interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

export interface Profile {
  name1: string;
  position1: string;
  name2: string;
  position2: string;
  name3: string;
  position3: string;
  name4: string;
  position4: string;
  name5: string;
  position5: string;
  name6: string;
  position6: string;
}

export interface Operator {
	id: number
	phonenumber: string;
	nearbynumber: string;
	staffname: string;
	position: string;
	unit: string;
	department: string;
	division: string;
	organization: string;
}