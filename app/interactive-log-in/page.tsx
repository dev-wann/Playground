'use client';

import { useState } from 'react';
import Instruction from '../components/Instruction';
import InteractiveEmoji from './InteractiveEmoji';

export enum StatusEnum {
  IDLE,
  EDITING,
  SUCCESS,
  FAIL,
}

export default function InteractiveLogIn() {
  const [userID, setID] = useState('');
  const [userPW, setPW] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [logInStatus, setStatus] = useState(StatusEnum.IDLE);
  const [xPos, setXPos] = useState<number | null>(null);

  // sample ID & password
  const SAMPLE_ID = 'test_user';
  const SAMPLE_PW = '1234567890';

  // log in mocking
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // validation
    // success
    if (userID === SAMPLE_ID && userPW === SAMPLE_PW) {
      setStatus(StatusEnum.SUCCESS);
      setError(null);
      return;
    }
    // fail
    setStatus(StatusEnum.FAIL);
    if (userID !== SAMPLE_ID) {
      setError('Check your ID!');
      return;
    } else if (userPW !== SAMPLE_PW) {
      setError('Check your password!');
      return;
    }

    //exhastive check
    throw new Error('Cannot validate');
  }

  // event handler for tracking text input
  function setPosition(e: React.SyntheticEvent) {
    const elem = e.target;
    if (!(elem instanceof HTMLInputElement)) return;

    const rect = elem.getBoundingClientRect();
    const inputLength = rect.right - rect.left - 16;

    const offset = elem.selectionStart;
    if (offset === null) return;
    const cursorOffset = Math.min(offset * 10, inputLength);

    setXPos(cursorOffset / inputLength);
  }

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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* ID */}
          <div className="flex items-center">
            <label
              className="inline-block w-10 text-lg font-bold font-mono"
              htmlFor="user_id"
            >
              ID:
            </label>
            <input
              className="px-2 py-1 grow text-black tracking-wider font-mono"
              type="text"
              id="user_id"
              name="user_id"
              onChange={(e) => setID(e.target.value)}
              onClick={(e) => setPosition(e)}
              onKeyUp={(e) => setPosition(e)}
              onFocus={() => setStatus(StatusEnum.EDITING)}
              onBlur={() => setXPos(null)}
              placeholder="test_user"
              contentEditable
            />
          </div>
          {/* password */}
          <div className="flex items-center">
            <label
              className="inline-block w-10 text-lg font-bold font-mono"
              htmlFor="user_password"
            >
              PW:
            </label>
            <input
              className="px-2 py-1 grow text-black tracking-wider font-mono"
              type="text"
              id="user_password"
              name="user_password"
              onChange={(e) => setPW(e.target.value)}
              onFocus={() => setStatus(StatusEnum.EDITING)}
              onKeyUp={setPosition}
              onClick={setPosition}
              onBlur={() => setXPos(null)}
              placeholder="1234567890"
            />
          </div>
          {/* submit button */}
          <button
            className="p-1 border-solid border-2 border-gray-400 text-gray-400 font-bold hover:border-white hover:text-white"
            type="submit"
          >
            LOG IN
          </button>
        </form>
      </div>
    </>
  );
}
