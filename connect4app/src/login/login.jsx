import React from 'react';

export function Login() {
  return (
    <main className="container-fluid text-center">
        <div className="bg-mid mx-auto p-5 rounded-4">
            <h1 className="text-light text-nowrap">Connect 4 Club Login</h1>
            <form method="get" action="play.html">
            <div className="input-group mb-3">
                <span className="input-group-text">Username:</span>
                <input className="form-control" type="text" placeholder="example@email.com" />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Password:</span>
                <input className="form-control" type="password" placeholder="password" />
            </div>
            <button className="btn btn-primary mx-auto px-4" type="submit">Login</button>
            <button className="btn bg-mid text-white mx-auto px-4" type="submit">Register</button>
            </form>
        </div>
        
    </main>
  );
}