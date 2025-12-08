import React from 'react';

import { LoggedOut } from './logged_out';

export function Login({ loginState, userName, onAuthChange }) {


  return (
    <main className="container-fluid text-center">
        <div className="bg-mid mx-auto p-5 rounded-4">
            <LoggedOut />
        </div>
        
    </main>
  );
}