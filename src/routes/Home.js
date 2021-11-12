import { collection, query, addDoc, onSnapshot, orderBy } from "@firebase/firestore";
import Tweet from "components/Tweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({userObj}) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

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
    await addDoc(collection(dbService, "tweets"), {
      text: tweet,
      creatorId: userObj.uid,
      createdAt: Date.now(),
    });
    setTweet("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} placeholder="type text" maxLength={140} />
        <input type="submit" value="tweet" />
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