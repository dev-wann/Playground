'use client';

import Image from 'next/image';
import { useState } from 'react';
import Instruction from '../components/Instruction';
import InteractiveEmoji from './InteractiveEmoji';

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
  const [showPW, setShowPW] = useState(false);

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
  function setPosition(elem: EventTarget | HTMLElement) {
    if (!(elem instanceof HTMLInputElement)) return;

    const rect = elem.getBoundingClientRect();
    const inputLength = rect.right - rect.left - 16;

    const offset = elem.selectionStart;
    if (offset === null) return;
    const cursorOffset = Math.min(offset * 10, inputLength);

    setXPos(cursorOffset / inputLength);
  }

  // event handler for password hide and show
  function toggleShowPW() {
    if (showPW && logInStatus === StatusEnum.EDIT_PW_SHOW) {
      setStatus(StatusEnum.EDIT_PW_HIDE);
    } else if (!showPW && logInStatus === StatusEnum.EDIT_PW_HIDE) {
      setStatus(StatusEnum.EDIT_PW_SHOW);
    }
    setShowPW(!showPW);

    const pwInput = document.getElementById('user_password');
    if (pwInput && pwInput instanceof HTMLInputElement) {
      const end = pwInput.value.length;
      pwInput.setSelectionRange(end, end);
      pwInput.focus();
      setPosition(pwInput);
    }
  }

  // event handler for password input focus
  function handlePWFocus() {
    if (
      logInStatus === StatusEnum.EDIT_PW_HIDE ||
      logInStatus === StatusEnum.EDIT_PW_SHOW
    ) {
      return;
    }
    setStatus(showPW ? StatusEnum.EDIT_PW_SHOW : StatusEnum.EDIT_PW_HIDE);
  }

  // icons
  const show = (
    <Image
      src="/images/interactive-log-in/eye.svg"
      width={20}
      height={20}
      alt="show password"
    />
  );
  const hide = (
    <Image
      src="/images/interactive-log-in/eye-off.svg"
      width={20}
      height={20}
      alt="hide password"
    />
  );

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
              ID:&nbsp;
            </label>
            <input
              className="px-2 py-1 min-w-[144px] grow shrink text-black tracking-wider font-mono"
              type="text"
              id="user_id"
              name="user_id"
              onChange={(e) => setID(e.target.value)}
              onClick={(e) => setPosition(e.target)}
              onKeyUp={(e) => setPosition(e.target)}
              onFocus={() => setStatus(StatusEnum.EDIT_ID)}
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
              PW:&nbsp;
            </label>
            <input
              className="pl-2 py-1 min-w-[120px] grow shrink text-black tracking-wider font-mono"
              type={showPW ? 'text' : 'password'}
              id="user_password"
              name="user_password"
              onChange={(e) => setPW(e.target.value)}
              onFocus={() => handlePWFocus()}
              onKeyUp={(e) => setPosition(e.target)}
              onClick={(e) => setPosition(e.target)}
              onBlur={() => setXPos(null)}
              placeholder="1234567890"
            />
            <div
              className="flex items-center w-[24px] h-[32px] shrink-0 bg-white cursor-pointer"
              onClick={() => toggleShowPW()}
            >
              {showPW ? show : hide}
            </div>
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
