
// Configure the Feathers services. (Can be re-generated.)
import { App } from '../app.interface';
import nedb1 from './nedb-1/nedb-1.service';

// !code: imports // !end
// !code: init // !end

// tslint:disable-next-line:no-unused-variable
let moduleExports = function (app: App) {
  app.configure(nedb1);
  // !code: func_return // !end
};

// !code: exports // !end
export default moduleExports;

// !code: funcs // !end
// !code: end // !end
