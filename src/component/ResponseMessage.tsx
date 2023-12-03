

interface IResponseProps {
  message: string;
}

const ResponseMessage = ({ message }: IResponseProps) => {
  return (
    <>
      <p className="message">{message}</p>
    </>
  );
};

export default ResponseMessage;
