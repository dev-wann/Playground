type Props = {
  userID: string;
  success: boolean;
  error: string | null;
};

export default function InteractiveEmoji({ userID, success, error }: Props) {
  // message
  let message: string | React.JSX.Element = 'Hello there!';
  if (success)
    message = (
      <>
        Welcome <b>{userID}</b>
      </>
    );
  if (error) message = <b>{error}</b>;

  // eyes
  const eyesIdle = (
    <>
      <div className="absolute w-[10%] pt-[20%] top-[25%] left-[30%] bg-yellow-950 rounded-full" />
      <div className="absolute w-[10%] pt-[20%] top-[25%] right-[30%] bg-yellow-950 rounded-full" />
    </>
  );
  const eyesSuccess = (
    <>
      <div className="absolute top-[15%] left-[20%] text-6xl text-yellow-950 text-center font-black">
        &gt;
      </div>
      <div className="absolute top-[15%] right-[20%] text-6xl text-yellow-950 text-center font-black">
        &lt;
      </div>
    </>
  );
  const eyesFail = (
    <>
      <div className="absolute top-[22%] left-[22%] text-5xl text-yellow-950 text-center font-black">
        X
      </div>
      <div className="absolute top-[22%] right-[22%] text-5xl text-yellow-950 text-center font-black">
        X
      </div>
    </>
  );

  // mouth
  const mouthIdle = (
    <div className="absolute w-[60%] pt-[30%] left-[20%] top-[60%] rounded-b-full bg-yellow-950" />
  );
  const mouthEdit = (
    <div className="absolute w-[20%] pt-[25%] left-[40%] top-[60%] rounded-full bg-yellow-950" />
  );

  // render
  return (
    <>
      {/* message */}
      <div className="w-4/5 p-1 m-auto mb-6 bg-white text-black text-center rounded relative">
        <p className={error ? 'text-red-500' : ''}>{message}</p>
        <div className="absolute top-full right-[15%] border-solid border-8 border-transparent border-t-white" />
      </div>

      {/* face */}
      <div className="relative w-3/5 pt-[60%] m-auto mb-8 ">
        {/* background */}
        <div className="absolute w-full h-full top-0 left-0 top bg-yellow-400 rounded-full" />

        {/* eyes */}
        {eyesIdle}
        {/* {eyesSuccess} */}
        {/* {eyesFail} */}

        {/* mouth */}
        {mouthIdle}
        {/* {mouthEdit} */}
      </div>
    </>
  );
}
