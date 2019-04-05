
// Define TypeScript interface for service `nedb2`. (Can be re-generated.)
// Import required enums
import { ItemTypeEnum } from '../../models/enums';

// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-empty-interface
export interface Nedb2Base {
  // !<DEFAULT> code: interface
  _id: unknown;
  nedb1Id: unknown;
  itemType: ItemTypeEnum;
  // !end
}

// tslint:disable-next-line:no-empty-interface
export interface Nedb2 extends Nedb2Base {
  // !<DEFAULT> code: more
  _id: any; // change if needed
  nedb1Id: any; // change if needed
  // !end
}

// !code: funcs // !end
// !code: end // !end
