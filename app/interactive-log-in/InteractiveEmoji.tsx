import { StatusEnum } from "./StatusEnum";

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
      <div className="absolute left-[30%] top-[27%] w-[10%] rounded-full bg-yellow-950 pt-[20%]" />
      <div className="absolute right-[30%] top-[27%] w-[10%] rounded-full bg-yellow-950 pt-[20%]" />
    </>
  );
  const eyesHalfClose = (
    <>
      <div className="absolute left-[20%] top-[15%] text-center text-6xl font-black text-yellow-950">
        &gt;
      </div>
      <div className="absolute right-[30%] top-[27%] w-[10%] rounded-full bg-yellow-950 pt-[20%]" />
    </>
  );

  const eyesSuccess = (
    <>
      <div className="absolute left-[20%] top-[15%] text-center text-6xl font-black text-yellow-950">
        &gt;
      </div>
      <div className="absolute right-[20%] top-[15%] text-center text-6xl font-black text-yellow-950">
        &lt;
      </div>
    </>
  );
  const eyesFail = (
    <>
      <div className="absolute left-[20%] top-1/4 text-center text-5xl font-black text-yellow-950">
        X
      </div>
      <div className="absolute right-[20%] top-1/4 text-center text-5xl font-black text-yellow-950">
        X
      </div>
    </>
  );

  // mouth
  const mouthIdle = (
    <div className="absolute left-[20%] top-[60%] w-3/5 rounded-b-full bg-yellow-950 pt-[30%]" />
  );
  const mouthEdit = (
    <div className="absolute left-[40%] top-[60%] w-1/5 rounded-full bg-yellow-950 pt-[25%]" />
  );
  const mouthFail = (
    <div className="absolute left-[30%] top-[70%] w-2/5 bg-yellow-950 pt-[5%]" />
  );

  // set message & facial expressions
  let message;
  let eyes, mouth;

  switch (status) {
    case StatusEnum.EDIT_ID:
      message = "So, your ID is...";
      eyes = eyesIdle;
      mouth = mouthEdit;
      break;
    case StatusEnum.EDIT_PW_HIDE:
      message = "I can see nothing!";
      eyes = eyesSuccess;
      mouth = mouthEdit;
      break;
    case StatusEnum.EDIT_PW_SHOW:
      message = "I might see something...?";
      eyes = eyesHalfClose;
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
      message = "Hello there!";
      eyes = eyesIdle;
      mouth = mouthIdle;
      break;
  }

  // chase cursor when editing
  let translate = "";

  if (
    (status === StatusEnum.EDIT_ID || status === StatusEnum.EDIT_PW_SHOW) &&
    pos !== null
  ) {
    const x = (pos - 0.5) * 50;
    const y = (2 - Math.pow(2 * pos - 1, 2)) * 10;
    translate = `${x}px ${y}px`;
  }

  // render
  return (
    <>
      {/* message */}
      <div className="relative m-auto mb-6 w-4/5 rounded bg-white p-1 text-center text-black">
        <p className={status === StatusEnum.FAIL ? "text-red-500" : ""}>
          {message}
        </p>
        <div className="absolute right-[15%] top-full border-8 border-solid border-transparent border-t-white" />
      </div>

      {/* face */}
      <div className="relative m-auto mb-8 w-3/5 pt-[60%]">
        {/* background */}
        <div className="absolute left-0 top-0 size-full rounded-full bg-yellow-400" />

        {/* facial expression */}
        <div
          className="absolute left-0 top-0 size-full transition-[translate] duration-500"
          style={{ translate: translate }}
        >
          {eyes}
          {mouth}
        </div>
      </div>
    </>
  );
}
