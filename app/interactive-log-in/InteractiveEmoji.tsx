import { StatusEnum } from './page';

type Props = {
  userID: string;
  status: StatusEnum;
  pos: number | null;
  error: string | null;
};

export default function InteractiveEmoji({
  userID,
  status,
  pos,
  error,
}: Props) {
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
      <div className="absolute top-[25%] left-[20%] text-5xl text-yellow-950 text-center font-black">
        X
      </div>
      <div className="absolute top-[25%] right-[20%] text-5xl text-yellow-950 text-center font-black">
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
  const mouthFail = (
    <div className="absolute w-[40%] pt-[5%] left-[30%] top-[70%] bg-yellow-950" />
  );

  // set message & facial expressions
  let message;
  let eyes, mouth;
  switch (status) {
    case StatusEnum.EDITING:
      message = '...';
      eyes = eyesIdle;
      mouth = mouthEdit;
      break;
    case StatusEnum.SUCCESS:
      message = (
        <>
          Welcome <b>{userID}</b>
        </>
      );
      eyes = eyesSuccess;
      mouth = mouthIdle;
      break;
    case StatusEnum.FAIL:
      message = <b>{error}</b>;
      eyes = eyesFail;
      mouth = mouthFail;
      break;
    default: // IDLE
      message = 'Hello there!';
      eyes = eyesIdle;
      mouth = mouthIdle;
      break;
  }

  // chase cursor when editing
  let translate = '';
  if (status === StatusEnum.EDITING && pos !== null) {
    const x = (pos - 0.5) * 50;
    const y = (2 - Math.pow(2 * pos - 1, 2)) * 10;
    translate = `${x}px ${y}px`;
  }

  // render
  return (
    <>
      {/* message */}
      <div className="w-4/5 p-1 m-auto mb-6 bg-white text-black text-center rounded relative">
        <p className={status === StatusEnum.FAIL ? 'text-red-500' : ''}>
          {message}
        </p>
        <div className="absolute top-full right-[15%] border-solid border-8 border-transparent border-t-white" />
      </div>

      {/* face */}
      <div className="relative w-3/5 pt-[60%] m-auto mb-8">
        {/* background */}
        <div className="absolute w-full h-full top-0 left-0 top bg-yellow-400 rounded-full" />

        {/* facial expression */}
        <div
          className="absolute w-full h-full top-0 left-0 transition-[translate] duration-500"
          style={{ translate: translate }}
        >
          {eyes}
          {mouth}
        </div>
      </div>
    </>
  );
}
