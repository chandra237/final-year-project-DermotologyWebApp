import React, { useState, useEffect, useContext,useRef } from 'react';
import { database } from '../firebase'; 
import { ref,push, get, set, child } from 'firebase/database';
import './AskQuestion.css'; // Import the CSS file
import AuthContext from '../store/app-context';

const AskQuestion = () => {
  const [question, setQuestion] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [userQuestions, setUserQuestions] = useState(null);
  const [updatedUserQuestions,setUpdatedUserQuestions] = useState(userQuestions);
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState('');
  const authCtx = useContext(AuthContext);
  const replyInputRef = useRef();

  const findCurrentUserName = (userDataArray,userId)=>{
    for (const userData of userDataArray) {
      const entry = Object.entries(userData)[0]; // Get the key-value pair
      const foundUserId = entry[0];
      const userName = entry[1];
      if (foundUserId === userId) {
        return userName;
      }
    }
    return null;
  }

  const currUserName = findCurrentUserName(authCtx.metaData,authCtx.userId);
  useEffect(() => {
    const fetchUserIds = async () => {
        try {
          const response = await fetch('http://localhost:5000//get_user_ids'); // URL matches Flask route
          if (!response.ok) {
            throw new Error('Failed to fetch user IDs');
          }
          const data = await response.json();
          console.log(data.user_ids);
          setUserIds(data.user_ids);
        } catch (error) {
          console.error('Error fetching user IDs:', error.message);
        }
      };
  
      fetchUserIds();
  }, []);
  console.log(userIds);
  useEffect(() => {
    const fetchUserQuestions = async () => {
        try 
        {
            const userQuestionsRef = ref(database, `users/${currUserName}/questions`);
            const snapshot = await get(userQuestionsRef);
            if (snapshot.exists()) {
              const questionsWithIds = Object.entries(snapshot.val()).map(([id, question]) => ({ id, ...question }));
              setUserQuestions(questionsWithIds);
            } else {
              setUserQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching user questions:', error.message);
        }
    };

    fetchUserQuestions();
  }, [authCtx.userId, currUserName]);

  console.log(userQuestions);
  console.log(userIds);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assume the current user's ID is 'currentUserId'
    const currentUserId = authCtx.userId;
    const otherUserIds = userIds.filter(id => id !== currentUserId);

    try {
        const questionRef = push(ref(database, `users/${currUserName}/questions`), {
            askedBy: currUserName,
            question: question,
            // Add the question ID to the data being pushed
            questionId: null, // Placeholder for the question ID
            // You can add other properties here if needed
        });

        // Get the key (question ID) of the newly created question
        const questionId = questionRef.key;
        for (const otherUserId of otherUserIds) {
            const findOtherUserName = (userDataArray,userId)=>{
              for (const userData of userDataArray) {
                const entry = Object.entries(userData)[0]; // Get the key-value pair
                const foundUserId = entry[0];
                const userName = entry[1];
                if (foundUserId === userId) {
                  return userName;
                }
              }
            }
            const otherUserName=findOtherUserName(authCtx.metaData,otherUserId);
            const questionRef = push(ref(database, `users/${otherUserName}/questions`), {
                askedBy: currUserName,
                question: question,
                // Add the question ID to the data being pushed
                questionId: questionId, // Placeholder for the question ID
                // You can add other properties here if needed
            });

            // Update the question with the generated question ID
            // await set(ref(database, `users/${userId}/questions/${questionId}`), {
            //     askedBy: currentUserId,
            //     question: question,
            //     questionId: questionId, // Update the question ID field
            //     // You can add other properties here if needed
            // });

            // Send the question ID to every other user or perform any other action
            // For demonstration purposes, we'll just log the question ID
            console.log(`Question ID sent to user ${otherUserName}:`, questionId);
        }
    } catch (error) {
        console.error('Error storing questions:', error.message);
    }

      // Clear the question input field after submitting
      setQuestion('');
  };

  const handleReplyButtonClick = (index) => {
    setReplyIndex(index); // Set the index of the question for which reply is being typed
  };

  const handleSendReply = async (index,recieverUserName,recieverQuestionId) => {
    const replyText = replyInputRef.current.value;
    console.log(`Sending reply to question at index ${index}: ${replyText}`);
    // const findRecieverUserName = (userDataArray,userId)=>{
    //   for (const userData of userDataArray) {
    //     const entry = Object.entries(userData)[0]; // Get the key-value pair
    //     const foundUserId = entry[0];
    //     const userName = entry[1];
    //     if (foundUserId === userId) {
    //       return userName;
    //     }
    //   }
    //   return null;
    // }

    // const recieverUserName = findRecieverUserName(authCtx.metaData,recieverUserId);
    try {
        // const currentUserId = authCtx.userId;
        // const questionId = userQuestions[index].id;
        console.log(userQuestions);
        // console.log(questionId);
        await set(ref(database, `users/${recieverUserName}/questions/${recieverQuestionId}/reply`), replyText);

        const currentUserId = authCtx.userId;
        // const questionId = userQuestions[index].id;

        // Get a reference to the question node
        const questionRef = ref(database, `users/${recieverUserName}/questions/${recieverQuestionId}`);

        // Push the new reply to the 'replies' node under the question
        const replyRef = push(child(questionRef, 'replies'), {
            senderId: currUserName,
            message: replyText,
            // Add other properties if needed
        });

        // Log the key of the newly added reply (optional)
        console.log('New reply key:', replyRef.key);

        // Clear the reply text and index
        setReplyText('');
        setReplyIndex(null);

        
    } catch (error) {
        console.error('Error sending reply:', error.message);
    }
  };

//   console.log(Array.isArray(userQuestions[0].replies));
  console.log(userQuestions);
  console.log(updatedUserQuestions);

  
  return (
    <div className='community-container'>
        <div className="user-questions-container">
            <h2>Community Hub</h2>
            <div className='scrollable-content'>
              <ul>
                  {userQuestions && userQuestions.map((userQuestion, index) => (
                  <li key={index}>
                      {userQuestion.askedBy === currUserName && <strong>{`>`}Your Question: </strong>}
                      {userQuestion.askedBy !== currUserName && <strong>{`>`}{userQuestion.askedBy}: </strong>}{userQuestion.question}
                      {currUserName !== userQuestion.askedBy && <button className='reply-button' onClick={() => handleReplyButtonClick(index)}>Reply</button>}
                      <div className='replies'>
                          {userQuestion.replies && (
                              <p>Replies:</p>
                          )}
                          <ul>
                              {userQuestion.replies && Object.keys(userQuestion.replies).map((replyId) => {
                                  const reply = userQuestion.replies[replyId];
                                  return (
                                      <li key={replyId}>
                                          {/* <strong>Sender:</strong> {reply.senderId}<br /> */}
                                          <strong>{reply.senderId}:</strong> {reply.message}  
                                      </li>
                                  );
                              })}
                          </ul>
                      </div>
                      
                      {replyIndex === index && (
                      <div className='send'>
                          <input
                          type="text"
                          ref={replyInputRef}
                          placeholder="Type your reply..."
                          className='input-text'
                          />
                          <button className='input-text-button' onClick={() => handleSendReply(index,userQuestion.askedBy,userQuestion.questionId)}>Send</button>
                      </div>
                      )}
                      
                  </li>
                  ))}
              </ul>
            </div>
        </div>
        <div className="question-form-container"> {/* Add a container class */}  
            <h2>Ask a Question</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question..."
                required
                className="question-textarea"
                ></textarea>
                <button type="submit" className="submit-button">Submit</button> {/* Add a button class */}
            </form>
        </div>
    </div>
  );
};

export default AskQuestion;
