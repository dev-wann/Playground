'use client';

import { useState } from 'react';
import Instruction from '../components/Instruction';
import InteractiveEmoji from './InteractiveEmoji';

export default function InteractiveLogIn() {
  const [userID, setID] = useState('');
  const [userPW, setPW] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sample ID & password
  const SAMPLE_ID = 'test_user';
  const SAMPLE_PW = '1234567890';

  // log in mocking
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // validation
    if (userID !== SAMPLE_ID) {
      setError('Check your ID!');
      return;
    }
    if (userPW !== SAMPLE_PW) {
      setError('Check your password!');
      return;
    }
    setSuccess(true);
    setError(null);
  }

  // render
  return (
    <>
      {/* instruction */}
      <Instruction instructions={['']} />

      {/* log in section */}
      <div className="max-w-[360px] m-auto p-12">
        {/* interactive emoji */}
        <InteractiveEmoji userID={userID} success={success} error={error} />

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
              className="px-2 py-1 grow text-black tracking-wider"
              type="text"
              id="user_id"
              name="user_id"
              onChange={(e) => setID(e.target.value)}
              placeholder="test_user"
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
              className="px-2 py-1 grow text-black tracking-wider"
              type="text"
              id="user_password"
              name="user_password"
              onChange={(e) => setPW(e.target.value)}
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
