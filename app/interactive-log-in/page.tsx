'use client';

import { useState } from 'react';
import Instruction from '../components/Instruction';
import InteractiveEmoji from './InteractiveEmoji';
import LogIn from './LogIn';

export enum StatusEnum {
  IDLE,
  EDIT_ID,
  EDIT_PW_HIDE,
  EDIT_PW_SHOW,
  SUCCESS,
  FAIL,
}

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
      <Instruction instructions={['']} />

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
