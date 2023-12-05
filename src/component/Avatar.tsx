
interface IavatarProp{
    picUrl: string
}

const Avatar = ({picUrl}: IavatarProp) => {
  return (
    <>
      <div>
        <img
          src={picUrl}
          alt=" photo"
          className="avatarPhoto"
        />
      </div>
    </>
  );
};

export default Avatar;
