import { useState, useEffect, useContext } from "react";

// internal components
import { dbService } from "../common/firebase";
import { UserAuth } from "../App";

const Main = () => {
  const userAuth = useContext(UserAuth);

  const [text, setText] = useState("");
  const [dbText, setDbText] = useState([]);

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

  // const onDelete = (textId) => {
  //   const deleteOk = window.confirm("삭제 하시겠습니까?");

  //   if (deleteOk) {
  //     dbService.doc(`send Message/${textId}`).delete();
  //   }
  // };

  // const onEditClick = () => {
  //   setEditClick((prev) => !prev);
  // };

  // const editChange = (e) => {
  //   const {
  //     target: { value },
  //   } = e;
  //   setEditText(value);
  // };

  // const lists = dbText.map((item) => {
  //   return (
  //     <>
  //       <li style={{ margin: "10px 0" }} key={`${item.createdAt}`}>
  //         {editClick ? <input type="text" value={editText} /> : item.text}
  //       </li>

  //       {userAuth.uid === item.createID && (
  //         <>
  //           <button onClick={() => onDelete(item.id)}>Delete</button>
  //           <button onClick={onEditClick}>Edit</button>
  //         </>
  //       )}
  //     </>
  //   );
  // });

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <input type="submit" value="send" />
      </form>
      <ul>
        {dbText.map((item) => (
          <MessageLists
            key={item.id}
            obj={item}
            isOwner={userAuth.uid === item.createID}
          />
        ))}
      </ul>
    </>
  );
};

export default Main;

const MessageLists = ({ obj, isOwner }) => {
  const [editClick, setEditClick] = useState(false);
  const [editText, setEditText] = useState(obj.text);

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

  const onSubmit = (e) => {
    e.preventDefault();
    dbService.doc(`send Message/${obj.id}`).update({ text: editText });
    setEditClick((prev) => !prev);
  };

  return (
    <>
      <div>
        {editClick ? (
          <>
            <form onSubmit={onSubmit}>
              <input type="text" value={editText} onChange={editChange} />{" "}
              <button onClick={onEditClick}>Cancel</button>
              <input type="submit" value="edit mes" />
            </form>
          </>
        ) : (
          obj.text
        )}
      </div>

      {isOwner && (
        <>
          <button onClick={() => onDelete(obj.id)}>Delete</button>
          <button onClick={onEditClick}>Edit</button>
        </>
      )}
    </>
  );
};
