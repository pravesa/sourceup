export {};

type Mail = {
  pri: string;
  sec?: Array<string>;
};

// Address fields for user collection
type Address = {
  _id: string;
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

declare global {
  // User collection fields
  interface User {
    _id: string;
    name?: string;
    gstn: string;
    pwd: string;
    mail: Mail;
    regd?: Address;
    head?: Address;
    isHeadSameAsRegd?: boolean;
    plant?: {
      [k: string]: Address;
    };
    warehouse?: {
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

  type Inventory = {
    _id: string;
    stocks: Material[];
  };
}
