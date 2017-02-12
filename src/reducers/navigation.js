import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  signin: {
    status: 'INIT',
  },
  signup: {
    status: 'INIT',
    error: -1,
  },
  status: {
    valid: false,
    isSignedIn: false,
    currentUser: '',
  },
};

export default function navigation(state, action) {
  if(typeof state === "undefined") {
    state = initialState;
  }

  switch(action.type) {
    // SIGN IN
    case types.USER_SIGNIN:
      return update(state, {
        signin: {
          status: {$set: 'WAITING'},
        },
      });
    case types.USER_SIGNIN_SUCCESS:
      return update(state, {
        signin: {
          status: {$set: 'SUCCESS'},
        },
        status: {
          isSignedIn: {$set: true},
          currentUser: {$set: action.email},
        },
      });
    case types.USER_SIGNIN_FAIL:
      return update(state, {
        signin: {
          status: {$set: 'FAILURE'},
        },
      });

    // SIGN UP
    case types.USER_SIGNUP:
      return update(state, {
        signup: {
          status: {$set: 'WAITING'},
          error: {$set: -1},
        },
      });

    // GET STATUS
    case types.USER_GET_STATUS:
      return update(state, {
        status: {
          isSignedIn: {$set: true},
        },
      });
    case types.USER_GET_STATUS_SUCCESS:
      return update(state, {
        status: {
          valid: {$set: true},
          currentUser: {$set: action.email},
        },
      });
    case types.USER_GET_STATUS_FAIL:
      return update(state, {
        status: {
          valid: {$set: false},
          isSignedIn: {$set: false},
        },
      });

    // SIGN OUT
    case types.USER_LOGOUT:
      return update(state, {
        status: {
          isSignedIn: {$set: false},
          currentUser: {$set: ''},
        },
      });
    default:
      return state;
  }
}
