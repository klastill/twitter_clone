import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import React from "react";
import { useState } from "react/cjs/react.development";
import { v4 } from "uuid";

const TweetFactory = ({userObj}) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    await addDoc(collection(dbService, "tweets"), {
      text: tweet,
      creatorId: userObj.uid,
      createdAt: Date.now(),
      attachmentUrl,
    });
    setTweet("");
    setAttachment("");
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const image = files[0];
    if (image) {
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(image);
    }
  };
  const onClearClick = () => setAttachment("");
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={onChange}
        placeholder="type text"
        maxLength={140}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="tweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearClick}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
