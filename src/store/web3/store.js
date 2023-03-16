import {state} from './state'
import {mutations} from './mutations'
import {actions} from './actions'
//收编
export const web = {
  namespaced: true,
  state,
  mutations,
  actions
};