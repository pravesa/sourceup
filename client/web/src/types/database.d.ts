export {};

type Mail = {
  pri: string;
  sec?: string;
};

declare global {
  // Address fields for user collection
  type Address = {
    bno: string;
    st: string;
    line1?: string;
    line2?: string;
    ldmk?: string;
    city: string;
    state: string;
    country: string;
    pncd: number;
  };

  // User collection fields
  interface User {
    _id: string;
    name: string;
    gstn: string;
    mail: Mail;
    regd?: Address;
    head?: Address;
    isHeadSameAsRegd: boolean;
    plant: {
      [k: string]: Address;
    };
    warehouse: {
      [k: string]: Address;
    };
    other?: {
      [k: string]: Address;
    };
    pref?: {
      [k: string]: unknown;
    };
  }

  interface Material {
    id: string;
    gsm: number;
    width: number;
    length?: number;
    material: 'kraft' | 'duplex';
    bf: number;
    color:
      | 'brown'
      | 'golden brown'
      | 'natural'
      | 'yellow'
      | 'golden yellow'
      | 'white'
      | 'white back'
      | 'silver';
    type: 'reel' | 'sheet';
    loc?: string;
    minLimit: number;
    maxLimit: number;
    stock: number;
  }

  type RequiredItem = {
    id: string;
    name: string;
    spec: {
      dimension: string;
      ply: number;
      gsm: string;
      bf: string;
      bs: string;
      material: string;
      color: string;
      printing: string;
    };
    moq: number;
  };

  type Requirements = {
    companyName: string;
    items: RequiredItem[];
  };

  type Quotations = {
    [k: string]: {
      [k: string]: Array<{quotedAt: Date; rate: number}>;
    };
  };
}
