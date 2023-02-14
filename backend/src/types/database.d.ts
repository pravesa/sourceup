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
    name: string;
    gstn: string;
    pwd: string;
    mail: Mail;
    loc?: {
      regd: Address;
      head?: Address;
      plant: {
        [k: string]: Address;
      };
      warehouse?: {
        [k: string]: Address;
      };
      other?: {
        [k: string]: Address;
      };
    };
    pref?: {
      [k: string]: unknown;
    };
  }
}
