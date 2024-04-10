# SkinCareExpert
It was a Deep Learning powered Dermotology web application built for the purpose of giving a one stop solution to the users about their skin diseases.

The speciality of our project compared to all other skin disease prediction projects are, they are simply find the corresponding disease associated with the image.
But coming to our project we aimed at implementing some features along with the prediction of that corresponding disease.

Straight to the working our model, we have prepared a dataset of five classes, in which each class should contain 250-300 images. we trained our CNN model with that images.
The five classes our model would predicts are:
    1.Acne <br />
    2.Acnitic Keratosis <br />
    3.Warts Molloscum <br />
    4.Light Diseases and Pigmentation <br />
    5.Ringworm <br />
    
Coming to the application, New users can signup and existing users can login to the application. once the user logged in, he will be landed on home page which allows the users to upload the image inorder to predict and a brief explanation about our appliaction.Apart from that our model provides various features that leverages our web application.

The features include: <br />
    ->Prediction History <br />
    ->Community <br />
    ->Chatbot <br />

Let me explain how these things work and useful to the customers,

**Prediction History**: This prediction history page will keep track of the individuals images along with the diseases that predicted, so that the users will aware of the images that they are uploaded and they also got know about the intensity of the skin disease. To store the images we have used firebase storage.

**Community Page**: In community page the users can interact with other users who are using this application, so that if any user has faced that disease they can interact with the other users. we have used firebase as a realtime database to store the messages for particular user.

**ChatBot**: Through the chatbot, the user can able to get more information regarding that disease and they can also get the precautions and remedies corresponding to the disease. To implement the chatbot we have used voiceflow, which allows the messages to send to server and getting reply from server and displaying it to the user. we have used GPT-3.5 and we specifically trained on our data.
