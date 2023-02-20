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
}
