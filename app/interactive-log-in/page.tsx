'use client';

import { useState } from 'react';
import Instruction from '../components/Instruction';
import InteractiveEmoji from './InteractiveEmoji';
import LogIn from './LogIn';
import { StatusEnum } from './StatusEnum';

export default function InteractiveLogIn() {
  const [userID, setID] = useState('');
  const [userPW, setPW] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [logInStatus, setStatus] = useState(StatusEnum.IDLE);
  const [xPos, setXPos] = useState<number | null>(null);

  // render
  return (
    <>
      {/* instruction */}
      <Instruction
        instructions={[
          'You can use a test ID and password:<br/>ID: test_user&emsp;password: 1234567890',
          'The facial expression of the emoji and the message above it represent the log-in status.',
          'The emoji follows your text cursor when you type ID or password (when set to visible).',
          'You can reset everything with the RESET button at the bottom.',
        ]}
      />

      {/* log in section */}
      <div className="max-w-[360px] m-auto p-12">
        {/* interactive emoji */}
        <InteractiveEmoji
          userID={userID}
          status={logInStatus}
          pos={xPos}
          error={error}
        />

        {/* log in form */}
        <LogIn
          userID={userID}
          userPW={userPW}
          setID={setID}
          setPW={setPW}
          setError={setError}
          setStatus={setStatus}
          setXPos={setXPos}
        />
      </div>
    </>
  );
}
