# Social Network Influencer Detector

In the digital time, social media has become a key platform for communication and information sharing. Beyond just being a social interaction platform, social media is a powerful arena where individuals or groups can shape public opinion, trends, and even major decisions. A major challenge in understanding social networks is identifying who truly has significant influence.

Using the concept of Eigenvector Centrality, the Influencer Detector application is designed to identify individuals with the greatest influence in a social network. Eigenvector Centrality measures not only how well-connected a node is but also the importance of those connections, providing a more accurate picture of who is genuinely influential.

This web-app is designed to analyze social networks and identify key influencers by leveraging Eigenvector Centrality and managing every user data including his tweets.


## Technologies, Languages, and Frameworks

Backend

	•	Language: JavaScript (Node.js)
	•	Frameworks/Libraries: Express.js, MySQL2
	•	Algorithm: Eigenvector Centrality

Frontend

	•	Language: JavaScript (React)
	•	Frameworks/Libraries: Material-UI, Axios

 
## Program Structure

Here’s an overview of the program structure:

 ```bash
/Social-Network-Influencer-Detector
|-- /backend
|   |-- /src
|   	|-- /controllers
|   	|-- /models
|   	|-- /routes
|   	|-- /services
|   	|-- /config
|   |-- server.js
|   |-- app.js
|   |-- .env
|-- /frontend
|   |-- /src
|	|-- /assets
|   	|-- /components
|		|-- /layout
|   	|-- /pages
|   	|-- /utils
|   |-- App.js
|   |-- index.js
|-- README.md
|-- package.json

```

## [Backend] Algorithm Components

**Eigenvector Centrality Explanation**

Eigenvector Centrality is a measure used in graph theory to determine the influence of a node in a network. It considers not only the number of connections a node has but also the quality and influence of those connections.

**Application of Eigenvector Centrality in Influencer Detection**

The Eigenvector Centrality algorithm is applied to detect influencers by evaluating the influence of users based on their connections and interactions. This helps identify key influencers within a network.

**Influence Factors Used**

	•	Followers Count: The number of followers a user has.
	•	Joined Date: The date the user joined the platform.
	•	Tweet Count: The total number of tweets made by the user.
	•	Likes Received: Total likes received on the user’s tweets.
	•	Retweets Received: Total retweets received on the user’s tweets.
	•	Replies Received: Number of replies to the user’s tweets.
	•	Adjacency Matrix: Representation of connections between users based on tweet interactions.

**Weights Used**

	•	Followers Count: 0.1
	•	Joined Date: 0.1
	•	Tweet Count: 0.1
	•	Likes Received: 0.2
	•	Retweets Received: 0.2
	•	Replies Received: 0.2
	•	Adjacency Matrix Influence: 0.1

**Example Cases, Calculation Process, and Results**

	•	Example Case: User A interacts with User B by replying to their tweet. This interaction is recorded in the adjacency matrix.
	•	Calculation Process: Eigenvector Centrality is calculated based on the weighted influence factors and adjacency matrix.
	•	Results: Users are ranked based on their influence scores, helping to identify the most influential users.

**Algorithm Analysis**
Time Complexity: The time complexity primarily depends on the matrix multiplication and eigenvalue computation. For large matrices, algorithms like power iteration or Lanczos method are often used, which can be more efficient than direct computation. Generally, matrix operations have a time complexity of  O(n^3)  for dense matrices, where  n  is the number of nodes.
Space Complexity: The space complexity is  O(n^2)  for storing the adjacency matrix and  O(n)  for the eigenvector. Sparse matrix representations can reduce space requirements.



## [Frontend] Frontend Components

**How to Run the Program**
- Clone the repository: git clone <repository-url>
- Navigate to the frontend directory: cd frontend
- Install dependencies: npm install
- Start the application: npm start
- Open the website's frontend on : localhost:3000


**List of Created Pages and Their Purposes**
- Dashboard Page : Shows top 10 users based on its calculations
- User Management Page: Allows users CRUD the list of existing users from the database
- Tweet Management Page: Allows users CRUD the list of existing tweets from the database
- Graph Visualization Page : Show users the visualization of every user's relationship

## Screenshots



## [Backend] Backend Components

**How to Run the Program**

- Clone the repository: git clone <repository-url>
- Navigate to the backend directory: cd backend
- Install dependencies: npm install
- Set up environment variables in a .env file.
- Start the server: npm start
- Open the website's backend on : localhost:5001

**List of Created Endpoints**




## [Backend] Database Components

**DBMS Used**

- Database Management System (DBMS): MySQL

**Entity Relationship Diagram (ERD)**


**Learning References**
