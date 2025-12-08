import React from 'react';

import { LoggedOut } from './logged_out';
import { LoggedIn } from './logged_in';

export function Login({ loginState, changeLoginState, username }) {


  return (
    <main className="container-fluid text-center">
        <div className="bg-mid mx-auto p-5 rounded-4">
          {loginState == true && <LoggedIn username={ username } onLogout={() => changeLoginState(username, false)}/>}
          {loginState == false && <LoggedOut onLogin={(username) => changeLoginState(username, true)}/>}
        </div>
    </main>
  );
}