import React from 'react';

import { LoggedOut } from './logged_out';
import { LoggedIn } from './logged_in';
import { EventType, GameEventBroker } from '../event_broker';

// TODO: configure game results sending
export function Login({ loginState, changeLoginState, username }) {
  return (
    <main className="container-fluid text-center">
        <div className="bg-mid mx-auto p-5 rounded-4">
          {loginState == true && <LoggedIn username={ username } onLogout={() => {
            changeLoginState('', false);
            GameEventBroker.createEvent(username, EventType.Websocket, 'logout');
          }}/>}
          {loginState == false && <LoggedOut onLogin={async (username) => {
            changeLoginState(username, true);
            await GameEventBroker.reconnectWebsocket();
            GameEventBroker.createEvent('guest', EventType.Websocket, 'login');
          }}/>}
        </div>
    </main>
  );
}