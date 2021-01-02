import { useState, useEffect, useContext } from "react";

// internal components
import { dbService } from "../common/firebase";
import { UserAuth } from "../App";
import { storageService } from "common/firebase";

const Main = () => {
  const userAuth = useContext(UserAuth);

  const [text, setText] = useState("");
  const [dbText, setDbText] = useState([]);
  const [fileBaseUrl, setFileBaseUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    // let imgPublicUrl = "";
    // if (imgPublicUrl !== "") {
    const fileRef = await storageService
      .ref()
      .child(`${userAuth.uid}/${Math.random().toString(36).substr(2, 11)}`)
      .putString(fileBaseUrl, "data_url");

    const imgPublicUrl = await fileRef.ref.getDownloadURL();
    // }
    const dbMessageObj = {
      text,
      createdAt: Date.now(),
      imgPublicUrl,
      creatorId: userAuth.uid,
    };

    await dbService.collection("send Message").add(dbMessageObj);

    setText("");
    setFileBaseUrl("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setText(value);
  };

  useEffect(() => {
    dbService.collection("send Message").onSnapshot((snapShot) => {
      const messageArray = snapShot.docs.map((item) => ({
        id: item.id,
        creatorId: item.creatorID,
        ...item.data(),
      }));
      setDbText(messageArray);
    });
  }, []);

  // file read
  const onChangeFile = (e) => {
    const {
      target: { files },
    } = e;

    const fileData = files[0];
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setFileBaseUrl(e.target.result);
    };
    reader.readAsDataURL(fileData);
  };

  const onDeleteImg = () => {
    setFileBaseUrl("");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <input type="file" accept="image/*" onChange={onChangeFile} />
        <input type="submit" value="send" />
        <div>
          {fileBaseUrl && (
            <>
              <img
                src={fileBaseUrl}
                width="50px"
                height="50px"
                alt="message img"
              />
              <button onClick={onDeleteImg}>Clear</button>
            </>
          )}
        </div>
      </form>
      <ul>
        {dbText.map((item) => (
          <MessageLists
            key={item.id}
            dbText={item}
            isOwner={userAuth.uid === item.creatorId}
          />
        ))}
      </ul>
    </>
  );
};

export default Main;

// message Components
const MessageLists = ({ dbText, isOwner }) => {
  const [editClick, setEditClick] = useState(false);
  const [editText, setEditText] = useState(dbText.text);

  const onDelete = async (textId) => {
    const deleteOk = window.confirm("삭제 하시겠습니까?");

    if (deleteOk) {
      await dbService.doc(`send Message/${dbText.textId}`).delete();
      await storageService.refFromURL(dbText.imgPublicUrl).delete();
    }
  };

  const onEditClick = () => {
    setEditClick((prev) => !prev);
  };

  const editChange = (e) => {
    const {
      target: { value },
    } = e;
    setEditText(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dbService.doc(`send Message/${dbText.id}`).update({ text: editText });
    setEditClick((prev) => !prev);
  };

  return (
    <>
      <div>
        {editClick ? (
          <>
            <form onSubmit={onSubmit}>
              <input type="text" value={editText} onChange={editChange} />
              <button onClick={onEditClick}>Cancel</button>
              <input type="submit" value="update message" />
            </form>
          </>
        ) : (
          <>
            <p>{dbText.text}</p>
            {dbText.imgPublicUrl && (
              <img
                src={dbText.imgPublicUrl}
                alt=""
                width="50px"
                height="50px"
              />
            )}
          </>
        )}
      </div>

      {isOwner && (
        <>
          <button onClick={() => onDelete(dbText.id)}>Delete</button>
          <button onClick={onEditClick}>Edit</button>
        </>
      )}
    </>
  );
};
