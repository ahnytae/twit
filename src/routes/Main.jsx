import { useState, useEffect, useContext } from "react";

// internal components
import { dbService } from "../common/firebase";
import { UserAuth } from "../App";

const Main = () => {
  const userAuth = useContext(UserAuth);

  const [text, setText] = useState("");
  const [dbText, setDbText] = useState([]);
  const [editClick, setEditClick] = useState(false);
  const [editText, setEditText] = useState(dbText.text);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("send Message").add({
      text,
      createdAt: Date.now(),
      createID: userAuth.uid,
    });
    setText("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setText(value);
  };

  // 방법1
  // const getDB = async () => {
  //   const dbMessage = await dbService.collection("send Message").get();
  //   dbMessage.forEach((document) => {
  //     setDbText((prev) => [document.data(), ...prev]);
  //   });
  // };

  // 방법2
  useEffect(() => {
    dbService.collection("send Message").onSnapshot((snapShot) => {
      const messageArray = snapShot.docs.map((item) => ({
        id: item.id,
        createID: item.createID,
        ...item.data(),
      }));
      setDbText(messageArray);
    });
  }, []);

  const onDelete = (textId) => {
    const deleteOk = window.confirm("삭제 하시겠습니까?");

    if (deleteOk) {
      dbService.doc(`send Message/${textId}`).delete();
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

  const lists = dbText.map((item) => {
    return (
      <>
        <li style={{ margin: "10px 0" }} key={`${item.createdAt}`}>
          {editClick ? <input type="text" value={editText} /> : item.text}
        </li>

        {userAuth.uid === item.createID && (
          <>
            <button onClick={() => onDelete(item.id)}>Delete</button>
            <button onClick={onEditClick}>Edit</button>
          </>
        )}
      </>
    );
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <input type="submit" value="send" />
      </form>
      <ul>{lists}</ul>
    </>
  );
};

export default Main;
