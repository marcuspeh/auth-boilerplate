import middlewareConstant from './middlewareConstant';
import tokenConstant from './tokenConstant';

export default {
  ...tokenConstant,
  ...middlewareConstant,

  EMPTY_STRING: '',
  EMPTY_JSON: {},
};
