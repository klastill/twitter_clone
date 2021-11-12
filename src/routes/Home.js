import { collection, query, addDoc, onSnapshot, orderBy } from "@firebase/firestore";
import Tweet from "components/Tweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 } from "uuid";

const Home = ({userObj}) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    const q = query(collection(dbService, "tweets"),
    orderBy('createdAt', "desc")
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const newArray = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
    setTweets(newArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const onChange = (event) => {
    const {target: {value}} = event;
    setTweet(value);
  }
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
    const {target: {files}} = event;
    const image = files[0];
    if (image) {
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {currentTarget: {result}} = finishedEvent;
        setAttachment(result);
      }
      reader.readAsDataURL(image);
    }
  };
  const onClearClick = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} placeholder="type text" maxLength={140} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
}
export default Home;